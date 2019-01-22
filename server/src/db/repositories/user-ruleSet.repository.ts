import * as mongoose from 'mongoose';
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

	public create(userId: string, ruleSetId: string): Promise<UserRuleSetModel> {
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

	public findById(id: string): Promise<UserRuleSetModel> {
		return new Promise((resolve, reject) => {
			this.UserRuleSet.findById(id, (error, userRuleSet: UserRuleSetModel) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(userRuleSet);
			});
		});
	}

	public async getAllRuleSets(userId: string): Promise<RuleSetModel[]> {
		return new Promise<RuleSetModel[]>((resolve, reject) => {
			this.UserRuleSet.find({userId: userId}, async (error, userRuleSets: UserRuleSetModel[]) => {
				if (error) {
					reject(error);
					return;
				}

				if (userRuleSets.length === 0) {
					resolve([]);
					return;
				}
				const ruleSets: RuleSetModel[] = [];
				for (let userRuleSet of userRuleSets) {
					const ruleSet: RuleSetModel = await this.ruleSetRepository.findById(userRuleSet.ruleSetId);
					ruleSets.push(ruleSet);
				}

				resolve(ruleSets);
			});
		});
	}

	public getAllByRuleSetId(ruleSetId: string): Promise<UserRuleSetModel[]> {
		return new Promise((resolve, reject) => {
			this.UserRuleSet.find({ruleSetId: ruleSetId}).exec((error, userRuleSets: UserRuleSetModel[]) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(userRuleSets);
			});
		});
	}

	public deleteAllByRuleSetId(ruleSetId: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.UserRuleSet.remove({ruleSetId: ruleSetId}, (error) => {
				if (error) {
					reject(error);
					return;
				}

				resolve();
			});
		});
	}
}