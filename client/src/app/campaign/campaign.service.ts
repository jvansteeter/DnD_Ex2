import { Injectable } from '@angular/core';
import { CampaignRepository } from '../repositories/campaign.repository';
import { IsReadyService } from '../utilities/services/isReady.service';
import { UserProfile } from '../types/userProfile';
import { SocialRepository } from '../social/social.repository';
import { Campaign } from '../../../../shared/types/campaign';
import { CampaignState } from './campaign.state';
import { Encounter } from '../../../../shared/types/encounter/encounter';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { mergeMap, tap } from 'rxjs/operators';


@Injectable()
export class CampaignService extends IsReadyService {
	public campaignId: string;
	public campaignState: CampaignState;

	private encounterSubject: BehaviorSubject<Encounter[]>;

	constructor(private campaignRepo: CampaignRepository,
							private socialRepo: SocialRepository) {
		super();
	}

	public init(): void {
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
		 ).subscribe((encounters: Encounter[]) => {
			this.campaignState.encounters = encounters;
			this.encounterSubject = new BehaviorSubject<Encounter[]>(this.campaignState.encounters);
			this.setReady(true);
		});
	}

	public setCampaignId(id: string): void {
		this.campaignId = id;
		this.setReady(false);
		this.init();
	}

	public sendInvitations(friends: UserProfile[]): void {
		friends.forEach((friend: UserProfile) => {
			this.socialRepo.sendCampaignInvite(friend._id, this.campaignId);
		});
	}

	public createEncounter(label: string): void {
		this.campaignRepo.createNewEncounter(label, this.campaignId)
		 .pipe(
			mergeMap(() => {
				return this.campaignRepo.getAllEncounters(this.campaignState._id)
			})
		 ).subscribe((encounters: Encounter[]) => {
			this.campaignState.encounters = encounters;
			this.encounterSubject.next(this.campaignState.encounters);
		});
	}

	get members(): UserProfile[] {
		return this.campaignState.members;
	}

	get encounters(): Encounter[] {
		return this.campaignState.encounters;
	}

	get encounterObservable(): Observable<Encounter[]> {
		return this.encounterSubject.asObservable();
	}
}