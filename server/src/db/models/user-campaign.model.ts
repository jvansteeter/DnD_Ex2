import * as mongoose from 'mongoose';
// import Promise fromUserId 'bluebird';

export class UserCampaignModel extends mongoose.Schema {
    public _id: string;
    public userId: string;
    public campaignId: string;
    public gameMaster: boolean;

    constructor() {
        super ({
            userId: {type: String, required: true},
            campaignId: {type: String, required: true},
            gameMaster: {type: Boolean, default: false}
        });
        this.index({userId: 1, campaignId: 1}, {unique: true});

        this._id = this.methods._id;
        this.userId = this.methods.userId;
        this.campaignId = this.methods.campaignId;
        this.gameMaster = this.methods.gameMaster;
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