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
                    reject (error);
                    return;
                }

                resolve(userRuleSetModel);
            });
        });
    }

    public findById(id: string): Promise<RuleSetModel> {
        return this.UserRuleSet.findById(id);
    }

    public getAllRuleSets(userId: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.UserRuleSet.find({userId: userId}, (error, userRuleSets: UserRuleSetModel[]) => {
                if (error) {
                    reject(error);
                    return;
                }

                let ruleSets: RuleSetModel[] = [];
                let complete: Function = () => { resolve(ruleSets) };
                let setCount = userRuleSets.length;
                if (userRuleSets.length === 0) {
                    resolve([]);
                }
                userRuleSets.forEach((userRuleSet: UserRuleSetModel) => {
                     this.ruleSetRepository.findById(userRuleSet.ruleSetId).then((ruleSet: RuleSetModel) => {
                         ruleSets.push(ruleSet);
                         if (--setCount === 0) {
                             complete();
                         }
                     });
                });

            });
        });
    }
}