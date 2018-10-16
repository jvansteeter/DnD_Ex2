import { IsReadyService } from '../utilities/services/isReady.service';
import { UserProfileService } from './userProfile.service';
import { CampaignPageService } from '../campaign/campaign-page.service';
import { Injectable } from '@angular/core';
import { EncounterService } from '../encounter/encounter.service';
import { isUndefined } from 'util';
import { Player } from '../encounter/player';

@Injectable()
export class RightsService extends IsReadyService {
	private encounterService: EncounterService;
	private campaignService: CampaignPageService;

	constructor(private userProfileService: UserProfileService) {
		super(userProfileService);
	}

	init(): void {
		this.dependenciesReady().subscribe((isReady) => {
			if (isReady) {
				this.setReady(true);
			}
		});
	}

	public isEncounterGM(): boolean {
		if (isUndefined(this.encounterService)) {
			return false;
		}
		for (let gm of this.encounterService.encounterState.gameMasters) {
			if (gm === this.userProfileService.userId) {
				return true;
			}
		}

		return false;
	}

	public isCampaignGM(userId: string = this.userProfileService.userId): boolean {
		if (isUndefined(this.campaignService) || isUndefined(this.campaignService.campaignState)) {
			return false;
		}
		for (let member of this.campaignService.campaignState.members) {
			if (member._id === userId) {
				return member['gameMaster'];
			}
		}

		return false;
	}

	public setCampaignService(campaignService: CampaignPageService): void {
		this.campaignService = campaignService;
		this.init();
	}

	public setEncounterService(encounterService: EncounterService): void {
		this.encounterService = encounterService;
		this.init();
	}

	public isMyPlayer(player: Player): boolean {
		return player.userId === this.userProfileService.userId;
	}
}
