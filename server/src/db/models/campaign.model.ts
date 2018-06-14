import * as mongoose from 'mongoose';
// import Promise from 'bluebird';
import { Campaign } from '../../../../shared/types/campaign';


export class CampaignModel extends mongoose.Schema implements Campaign {
    public _id;
    public label: string;
    public ruleSetId: string;

    constructor() {
        super ({
            label: String,
            ruleSetId: String
        });

        this._id = this.methods._id;
        this.label = this.methods.label;
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