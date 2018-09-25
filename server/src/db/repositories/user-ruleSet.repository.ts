import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { RuleSetModel } from '../models/ruleSet.model';
import { UserRuleSetModel } from '../models/user-ruleSet.model';
import { RuleSetRepository } from './ruleSet.repository';

export class UserRuleSetRepository {
	private UserRuleSet: mongoose.Model<mongoose.Document>;
	private ruleSetRepository: RuleSetRepository;

	constructor() {
		this.UserRuleSet = mongoose.model('User_RuleSet');
		this.ruleSetRepository = new RuleSetRepository();
	}

	public create(userId: string, ruleSetId: string): Promise<Error | RuleSetModel> {
		return new Promise((resolve, reject) => {
			this.UserRuleSet.create({
				userId: userId,
				ruleSetId: ruleSetId
			}, (error, userRuleSetModel: UserRuleSetModel) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(userRuleSetModel);
			});
		});
	}

	public findById(id: string): Promise<RuleSetModel> {
		return this.UserRuleSet.findById(id);
	}

	public async getAllRuleSets(userId: string): Promise<RuleSetModel[]> {
		return new Promise((resolve, reject) => {
			this.UserRuleSet.find({userId: userId}, async (error, userRuleSets: UserRuleSetModel[]) => {
				if (error) {
					reject(error);
					return;
				}

				let ruleSets: RuleSetModel[] = [];
				if (userRuleSets.length === 0) {
					resolve([]);
				}
				for (let userRuleSet of userRuleSets) {
					const ruleSet: RuleSetModel = await this.ruleSetRepository.findById(userRuleSet.ruleSetId);
					ruleSets.push(ruleSet);
				}

				resolve(ruleSets);
			});
		});
	}
}