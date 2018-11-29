import { Injectable } from '@angular/core';
import { CampaignRepository } from '../repositories/campaign.repository';
import { IsReadyService } from '../utilities/services/isReady.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MqService } from '../mq/mq.service';
import { CampaignData } from '../../../../shared/types/campaign.data';

@Injectable()
export class CampaignService extends IsReadyService {
	private _campaigns: CampaignData[];

	constructor(private campaignRepository: CampaignRepository,
	            private mqService: MqService) {
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

	public getCampaign(campaignId: string): Observable<CampaignData> {
		return this.campaignRepository.getCampaign(campaignId);
	}

	public deleteCampaign(campaignId: string): Observable<void> {
		return this.campaignRepository.deleteCampaign(campaignId);
	}

	public joinCampaign(campaignId: string): Observable<void> {
		return this.campaignRepository.joinCampaign(campaignId).pipe(
				tap(() => {
					this.mqService.sendCampaignUpdate(campaignId);
				})
		);
	}

	get campaigns(): CampaignData[] {
		return this._campaigns;
	}
}