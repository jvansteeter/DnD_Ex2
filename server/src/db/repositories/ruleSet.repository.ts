import * as mongoose from 'mongoose';
import { RuleSetModel } from '../models/ruleSet.model';

export class RuleSetRepository {
	private RuleSet: mongoose.Model<mongoose.Document>;

	constructor() {
		this.RuleSet = mongoose.model('RuleSet');
	}

	public create(label: string): Promise<RuleSetModel> {
		return new Promise((resolve, reject) => {
			this.RuleSet.create({
				label: label
			}, (error, newRuleSet: RuleSetModel) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(newRuleSet);
			});
		});
	}

	public findById(id: string): Promise<RuleSetModel> {
		return new Promise((resolve, reject) => {
			this.RuleSet.findById(id, (error, ruleSet: RuleSetModel) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(ruleSet);
			})
		});
	}

	public deleteById(id: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.RuleSet.remove({_id: id}, (error) => {
				if (error) {
					reject(error);
					return;
				}

				resolve();
			});
		});
	}
}