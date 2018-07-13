import { Injectable } from '@angular/core';
import { CampaignRepository } from '../repositories/campaign.repository';
import { Campaign } from '../../../../shared/types/campaign';
import { IsReadyService } from '../utilities/services/isReady.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CampaignService extends IsReadyService {
	private _campaigns: Campaign[];

	constructor(private campaignRepository: CampaignRepository) {
		super();
		this._campaigns = [];
		this.init();
	}


	public init(): void {
		this.campaignRepository.getCampaigns().subscribe((campaigns: any[]) => {
			this._campaigns = campaigns;
			this.setReady(true);
		});
	}

	public refreshCampaigns(): void {
		this.setReady(false);
		this.init();
	}

	public getCampaign(campaignId: string): Observable<Campaign> {
		return this.campaignRepository.getCampaign(campaignId);
	}

	public joinCampaign(campaignId: string): Observable<void> {
		return this.campaignRepository.joinCampaign(campaignId);
	}

	get campaigns(): Campaign[] {
		return this._campaigns;
	}
}