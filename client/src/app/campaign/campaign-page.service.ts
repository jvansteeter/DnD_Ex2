import { Injectable } from '@angular/core';
import { CampaignRepository } from '../repositories/campaign.repository';
import { IsReadyService } from '../utilities/services/isReady.service';
import { UserProfile } from '../types/userProfile';
import { CampaignState } from './campaign.state';
import { Observable, BehaviorSubject } from 'rxjs';
import { first, flatMap, map, mergeMap, tap } from 'rxjs/operators';
import { MqService } from '../mq/mq.service';
import { Subscription, Subject } from 'rxjs';
import { EncounterData } from '../../../../shared/types/encounter/encounter.data';
import { CampaignData } from '../../../../shared/types/campaign.data';
import { CharacterRepository } from '../repositories/character.repository';
import { CharacterData } from '../../../../shared/types/character.data';
import { EncounterRepository } from '../repositories/encounter.repository';
import { RightsService } from '../data-services/rights.service';
import { RuleSetService } from '../data-services/ruleSet.service';

@Injectable()
export class CampaignPageService extends IsReadyService {
	public campaignId: string;
	public campaignState: CampaignState;

	private readonly _encounterSubject: BehaviorSubject<EncounterData[]>;
	private readonly _membersSubject: BehaviorSubject<UserProfile[]>;
	private readonly _charactersSubject: BehaviorSubject<CharacterData[]>;
	private campaignMessageSubscription: Subscription;
	private _gameMasters: string[];

	constructor(private campaignRepo: CampaignRepository,
	            private characterRepo: CharacterRepository,
	            private encounterRepo: EncounterRepository,
	            private mqService: MqService,
	            private rightsService: RightsService,
	            private ruleSetService: RuleSetService) {
		super(mqService);
		this._encounterSubject = new BehaviorSubject<EncounterData[]>([]);
		this._membersSubject = new BehaviorSubject<UserProfile[]>([]);
		this._charactersSubject = new BehaviorSubject<CharacterData[]>([]);
	}

	public init(): void {
		this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady && !this.isReady()) {
				this.getCampaignState().pipe(
						tap(() => {
							this.rightsService.setCampaignService(this);
							this.ruleSetService.setRuleSetId(this.campaignState.ruleSetId);
							this.observeCampaignUpdates();
						}),
						mergeMap(() => {
							return this.updateEncountersList()
						})).subscribe(() => {
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

	public createEncounter(label: string, cellRes: number, mapDimX?: number, mapDimY?: number, mapUrl?: string): void {
		this.encounterRepo.createNewEncounter(label, this.campaignId, cellRes, mapDimX, mapDimY, mapUrl)
				.pipe(
						mergeMap(() => {
							return this.updateEncountersList();
						})
				).subscribe();
	}

	public createEncounterFromJson(json: EncounterData): Observable<void> {
		return this.encounterRepo.createEncounterFromJson(this.campaignId, json).pipe(
				flatMap(() => {return this.updateEncountersList();})
		);
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

	public setIsGameMaster(userId: string, isGameMaster: boolean): void {
		this.campaignRepo.setIsGameMaster(this.campaignId, userId, isGameMaster).subscribe(() => {
			this.mqService.sendCampaignUpdate(this.campaignId);
		});
	}

	public deleteCharacter(characterId: string): void {
		this.characterRepo.deleteCharacter(characterId).subscribe(() => {
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
							this._gameMasters = [];
							for (let member of members) {
								if (member['gameMaster'] === true) {
									this._gameMasters.push(member._id);
								}
							}
							this._membersSubject.next(this.campaignState.members);
						}),
						// mergeMap(() => {
						// 	return this.updateEncountersList();
						// }),
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
			this.getCampaignState().pipe(mergeMap(() => {
				return this.updateEncountersList();
			})).subscribe();
		});
	}

	private updateEncountersList(): Observable<void> {
		return this.campaignRepo.getAllEncounters(this.campaignState._id).pipe(map((encounters: EncounterData[]) => {
			if (this.rightsService.isCampaignGM()) {
				this.campaignState.encounters = encounters;
			}
			else {
				this.campaignState.encounters = [];
				for (let encounter of encounters) {
					if (encounter.isOpen) {
						this.campaignState.encounters.push(encounter);
					}
				}
			}
			this._encounterSubject.next(this.campaignState.encounters);
			return;
		}));
	}
}