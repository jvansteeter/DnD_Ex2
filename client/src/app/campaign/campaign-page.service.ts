import { Injectable } from '@angular/core';
import { CampaignRepository } from '../repositories/campaign.repository';
import { IsReadyService } from '../utilities/services/isReady.service';
import { UserProfile } from '../types/userProfile';
import { CampaignState } from './campaign.state';
import { Observable, BehaviorSubject } from 'rxjs';
import { first, map, mergeMap, tap } from 'rxjs/operators';
import { MqService } from '../mq/mq.service';
import { Subscription, Subject } from 'rxjs';
import { EncounterData } from '../../../../shared/types/encounter/encounter.data';
import { CampaignData } from '../../../../shared/types/campaign.data';
import { CharacterRepository } from '../repositories/character.repository';
import { CharacterData } from '../../../../shared/types/character.data';
import { EncounterRepository } from '../repositories/encounter.repository';

@Injectable()
export class CampaignPageService extends IsReadyService {
	public campaignId: string;
	public campaignState: CampaignState;

	private readonly _encounterSubject: BehaviorSubject<EncounterData[]>;
	private readonly _membersSubject: BehaviorSubject<UserProfile[]>;
	private readonly _charactersSubject: BehaviorSubject<CharacterData[]>;
	private campaignMessageSubscription: Subscription;

	constructor(private campaignRepo: CampaignRepository,
	            private characterRepo: CharacterRepository,
	            private encounterRepo: EncounterRepository,
	            private mqService: MqService) {
		super(mqService);
		this._encounterSubject = new BehaviorSubject<EncounterData[]>([]);
		this._membersSubject = new BehaviorSubject<UserProfile[]>([]);
		this._charactersSubject = new BehaviorSubject<CharacterData[]>([]);
	}

	public init(): void {
		this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady) {
				this.getCampaignState().subscribe(() => {

					this.observeCampaignUpdates();
					this.setReady(true);
				});
			}
			else {
				this.setReady(false);
			}
		});
	}

	unInit(): void {
		super.unInit();
		if (this.campaignMessageSubscription) {
			this.campaignMessageSubscription.unsubscribe();
		}
	}

	public setCampaignId(id: string): void {
		this.campaignId = id;
		this.setReady(false);
		this.init();
	}

	public sendInvitations(friends: UserProfile[]): void {
		friends.forEach((friend: UserProfile) => {
			this.mqService.sendCampaignInvite(friend._id, this.campaignId);
		});
	}

	public createEncounter(label: string, mapDimX?: number, mapDimY?: number, mapUrl?: string): void {
		this.encounterRepo.createNewEncounter(label, this.campaignId, mapDimX, mapDimY, mapUrl)
				.pipe(
						mergeMap(() => {
							return this.updateEncountersList();
						})
				).subscribe();
	}

	public deleteEncounter(encounterId: string): void {
		this.encounterRepo.deleteEncounter(encounterId)
				.pipe(mergeMap(() => {
					return this.updateEncountersList()
				})).subscribe();
	}

	public openEncounter(encounterId: string): void {
		this.campaignState.getEncounter(encounterId).isOpen = true;
		this.encounterRepo.openEncounter(encounterId).subscribe(() => {
			this.mqService.sendCampaignUpdate(this.campaignId);
		});
	}

	public closeEncounter(encounterId: string): void {
		this.campaignState.getEncounter(encounterId).isOpen = false;
		this.encounterRepo.closeEncounter(encounterId).subscribe(() => {
			this.mqService.sendCampaignUpdate(this.campaignId);
		});
	}

	get members(): UserProfile[] {
		return this.campaignState.members;
	}

	get membersSubject(): Subject<UserProfile[]> {
		return this._membersSubject;
	}

	get encounters(): EncounterData[] {
		return this.campaignState.encounters;
	}

	get encounterSubject(): Subject<EncounterData[]> {
		return this._encounterSubject;
	}

	get characterSubject(): Subject<CharacterData[]> {
		return this._charactersSubject;
	}

	private getCampaignState(): Observable<void> {
		return this.campaignRepo.getCampaign(this.campaignId)
				.pipe(
						tap((campaign: CampaignData) => {
							this.campaignState = new CampaignState(campaign);
						}),
						mergeMap(() => {
							return this.campaignRepo.getCampaignMembers(this.campaignState._id);
						}),
						tap((members: UserProfile[]) => {
							this.campaignState.members = members;
							this._membersSubject.next(this.campaignState.members);
						}),
						mergeMap(() => {
							return this.updateEncountersList();
						}),
						mergeMap(() => {
							return this.characterRepo.getCharactersByCampaignId(this.campaignId);
						}),
						tap((characters: CharacterData[]) => {
							this.campaignState.characters = characters;
							this._charactersSubject.next(this.campaignState.characters);
						}),
						map(() => {
							return;
						}),
						first()
				);
	}

	private observeCampaignUpdates(): void {
		this.campaignMessageSubscription = this.mqService.getIncomingCampaignMessages(this.campaignId).subscribe(() => {
			this.getCampaignState().subscribe();
		});
	}

	private updateEncountersList(): Observable<void> {
		return this.campaignRepo.getAllEncounters(this.campaignState._id).pipe(map((encounters: EncounterData[]) => {
			this.campaignState.encounters = encounters;
			this._encounterSubject.next(this.campaignState.encounters);
			return;
		}));
	}
}