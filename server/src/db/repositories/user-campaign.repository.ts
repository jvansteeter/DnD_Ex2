import * as mongoose from 'mongoose';
// import { Promise } from 'bluebird';
import { CampaignRepository } from './campaign.repository';
import { UserCampaignModel } from '../models/user-campaign.model';

export class UserCampaignRepository {
    private UserCampaign: mongoose.Model<mongoose.Document>;
    private campaignRepository: CampaignRepository;

    constructor() {
        this.UserCampaign = mongoose.model('User_Campaign');
        this.campaignRepository = new CampaignRepository();
    }

    public create(userId: string, campaignId: string, gameMaster: boolean): Promise<UserCampaignModel> {
        return new Promise((resolve, reject) => {
            this.UserCampaign.create({
                userId: userId,
                campaignId: campaignId,
                gameMaster: gameMaster
            }, (error, userCampaign: UserCampaignModel) => {
                if (error) {
                    reject (error);
                    return;
                }

                resolve(userCampaign);
            });
        });
    }

    public findById(id: string): Promise<UserCampaignModel> {
        return new Promise((resolve, reject) => {
            this.UserCampaign.findById(id, (error, userCampaign: UserCampaignModel) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(userCampaign);
            });
        });
    }

    public findAllForUser(userId: string): Promise<UserCampaignModel[]> {
        return new Promise((resolve, reject) => {
            this.UserCampaign.find({userId: userId}, (error, userCampaigns: UserCampaignModel[]) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(userCampaigns);
            });
        });
    }

    public findAllForCampaign(campaignId: string): Promise<UserCampaignModel[]> {
        return new Promise((resolve, reject) => {
            this.UserCampaign.find({campaignId: campaignId}, (error, userCampaigns: UserCampaignModel[]) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(userCampaigns);
            });
        });
    }
}