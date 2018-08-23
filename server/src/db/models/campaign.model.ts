import * as mongoose from 'mongoose';
import { CampaignData } from '../../../../shared/types/campaign.data';
import { MongooseModel } from './mongoose.model';


export class CampaignModel extends MongooseModel implements CampaignData {
	public _id;
	public label: string;
	public ruleSetId: string;

	constructor() {
		super({
			label: String,
			ruleSetId: String
		});

		this._id = this.methods._id;
		this.label = this.methods.label;
		this.ruleSetId = this.methods.ruleSetId;
	}
}

mongoose.model('Campaign', new CampaignModel());