import { CampaignModel } from '../db/models/campaign.model';
import { CampaignRepository } from '../db/repositories/campaign.repository';
import { UserCampaignModel } from '../db/models/user-campaign.model';
import { UserCampaignRepository } from '../db/repositories/user-campaign.repository';
import { Promise } from 'bluebird';

export class CampaignService {
    private campaignRepository: CampaignRepository;
    private userCampaignRepository: UserCampaignRepository;

    constructor() {
        this.campaignRepository = new CampaignRepository();
        this.userCampaignRepository = new UserCampaignRepository();
    }

    public create(label: string, ruleSetId: string): Promise<CampaignModel> {
        return this.campaignRepository.create(label, ruleSetId);
    }

    public findAllForUser(userId: string): Promise<UserCampaignModel[]> {
        return new Promise((resolve, reject) => {
            this.userCampaignRepository.findAllForUser(userId).then((userCampaigns: UserCampaignModel[]) => {
                 let userCampaignCount = userCampaigns.length;
                 if (userCampaignCount === 0) {
                     resolve([]);
                     return;
                 }

                 let campaigns: CampaignModel[] = [];
                 userCampaigns.forEach((userCampaign : UserCampaignModel) => {
                     this.campaignRepository.findById(userCampaign.campaignId).then((campaign: CampaignModel) => {
                         campaigns.push(campaign);

                         if (--userCampaignCount === 0) {
                             resolve(campaigns);
                         }
                     });
                 });
            }, error => reject(error));
        });
    }
}