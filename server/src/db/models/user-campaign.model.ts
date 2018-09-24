import * as mongoose from 'mongoose';
import { MongooseModel } from './mongoose.model';

export class UserCampaignModel extends MongooseModel {
	public _id: string;
	public userId: string;
	public campaignId: string;
	public gameMaster: boolean;

	constructor() {
		super({
			userId: {type: String, required: true},
			campaignId: {type: String, required: true},
			gameMaster: {type: Boolean, default: false}
		});
		this.index({userId: 1, campaignId: 1}, {unique: true});

		this._id = this.methods._id;
		this.userId = this.methods.userId;
		this.campaignId = this.methods.campaignId;
		this.gameMaster = this.methods.gameMaster;

		this.methods.setIsGameMaster = this.setIsGameMaster;
	}

	public setIsGameMaster(isGameMaster: boolean): Promise<UserCampaignModel> {
		this.gameMaster = isGameMaster;
		return this.save();
	}
}

mongoose.model('User_Campaign', new UserCampaignModel());