import { Injectable } from '@angular/core';
import { CampaignRepository } from '../repositories/campaign.repository';
import { IsReadyService } from '../utilities/services/isReady.service';
import { UserProfile } from '../types/userProfile';
import { Campaign } from '../../../../shared/types/campaign';
import { CampaignState } from './campaign.state';
import { Observable, BehaviorSubject } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { EncounterStateData } from '../../../../shared/types/encounter/encounterState';
import { MqService } from '../mq/mq.service';


@Injectable()
export class CampaignPageService extends IsReadyService {
	public campaignId: string;
	public campaignState: CampaignState;

	private encounterSubject: BehaviorSubject<EncounterStateData[]>;

	constructor(private campaignRepo: CampaignRepository,
	            private mqService: MqService) {
		super(mqService);
	}

	public init(): void {
		this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady) {
				this.campaignRepo.getCampaign(this.campaignId)
						.pipe(
								tap((campaign: Campaign) => {
									this.campaignState = new CampaignState(campaign);
								}),
								mergeMap(() => {
									return this.campaignRepo.getCampaignMembers(this.campaignState._id);
								}),
								tap((members: UserProfile[]) => {
									this.campaignState.members = members;
								}),
								mergeMap(() => {
									return this.campaignRepo.getAllEncounters(this.campaignState._id);
								})
						).subscribe((encounters: EncounterStateData[]) => {
					this.campaignState.encounters = encounters;
					this.encounterSubject = new BehaviorSubject<EncounterStateData[]>(this.campaignState.encounters);
					this.setReady(true);
				});
			}
			else {
				this.setReady(false);
			}
		});
	}

	public setCampaignId(id: string): void {
		this.campaignId = id;
		this.setReady(false);
		this.init();
	}

	public sendInvitations(friends: UserProfile[]): void {
		friends.forEach((friend: UserProfile) => {
			this.mqService.sendCampaignInvite(friend._id);
		});
	}

	public createEncounter(label: string): void {
		this.campaignRepo.createNewEncounter(label, this.campaignId)
		 .pipe(
			mergeMap(() => {
				return this.campaignRepo.getAllEncounters(this.campaignState._id)
			})
		 ).subscribe((encounters: EncounterStateData[]) => {
			this.campaignState.encounters = encounters;
			this.encounterSubject.next(this.campaignState.encounters);
		});
	}

	get members(): UserProfile[] {
		return this.campaignState.members;
	}

	get encounters(): EncounterStateData[] {
		return this.campaignState.encounters;
	}

	get encounterObservable(): Observable<EncounterStateData[]> {
		return this.encounterSubject.asObservable();
	}
}