import { Injectable } from '@angular/core';
import { CampaignRepository } from '../repositories/campaign.repository';
import { Observable } from 'rxjs/Observable';
import { IsReadyService } from '../utilities/services/isReady.service';


@Injectable()
export class CampaignService extends IsReadyService {
    public campaignId: string;
    public campaign: any;
    public members: any[];

    constructor(private campaignRepo: CampaignRepository) {
        super();
    }

    public init(): void {
        this.campaign = {};
        this.members = [];
        this.campaignRepo.getCampaign(this.campaignId).subscribe((campaign: any) => {
            this.campaign = campaign;
            this.campaignRepo.getCampaignMembers(this.campaignId).subscribe(members => {
                this.members = members;
                this.setReady(true);
            });
        });
    }

    public setCampaignId(id: string): void {
        this.campaignId = id;
        this.setReady(false);
        this.init();
    }

    public sendInvitations(userIds: string[]): Observable<void> {
        return this.campaignRepo.sendInvitations(this.campaignId, userIds);
    }
}