import * as mongoose from 'mongoose';
import Promise from 'bluebird';


export class CampaignModel extends mongoose.Schema {
    public _id;
    public title: string;
    public ruleSetId: string;

    constructor() {
        super ({
            title: String,
            ruleSetId: String
        });

        this._id = this.methods._id;
        this.title = this.methods.title;
        this.ruleSetId = this.methods.ruleSetId;
    }

    private save(): Promise<CampaignModel> {
        return new Promise((resolve, reject) => {
            this.methods.save((error, campaign: CampaignModel) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(campaign);
            })
        });
    }
}

mongoose.model('Campaign', new CampaignModel());