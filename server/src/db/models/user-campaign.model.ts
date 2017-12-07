import * as mongoose from 'mongoose';
import Promise from 'bluebird';

export class UserCampaignModel extends mongoose.Schema {
    public _id: string;
    public userId: string;
    public campaignId: string;

    constructor() {
        super ({
            userId: {type: String, required: true},
            campaignId: {type: String, required: true}
        });

        this._id = this.methods._id;
        this.userId = this.methods.userId;
        this.campaignId = this.methods.campaignId;
    }

    private save(): Promise<UserCampaignModel> {
        return new Promise((resolve, reject) => {
            this.methods.save((error, userCampaign: UserCampaignModel) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(userCampaign);
            })
        });
    }
}

mongoose.model('User_Campaign', new UserCampaignModel());