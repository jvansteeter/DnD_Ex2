import * as mongoose from 'mongoose';
import { CampaignModel } from '../models/campaign.model';

export class CampaignRepository {
	private Campaign: mongoose.Model<mongoose.Document>;

	constructor() {
		this.Campaign = mongoose.model('Campaign');
	}

	public create(label: string, ruleSetId: string): Promise<CampaignModel> {
		return new Promise((resolve, reject) => {
			this.Campaign.create({
				label: label,
				ruleSetId: ruleSetId
			}, (error, campaign: CampaignModel) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(campaign);
			});
		});
	}

	public findById(id: string): Promise<CampaignModel> {
		return new Promise((resolve, reject) => {
			this.Campaign.findById(id, (error, campaign: CampaignModel) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(campaign);
			})
		});
	}

	public findByRuleSetId(ruleSetId: string): Promise<CampaignModel[]> {
		return new Promise((resolve, reject) => {
			this.Campaign.find({ruleSetId: ruleSetId}, (error, campaigns: CampaignModel[]) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(campaigns);
			})
		});
	}

	public deleteById(id: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.Campaign.remove({_id: id}, (error) => {
				if (error) {
					reject(error);
					return;
				}

				resolve();
			});
		});
	}
}
