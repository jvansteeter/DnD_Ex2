import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { RuleSetModel } from '../models/ruleSet.model';
import { UserModel } from '../models/user.model';

export class RuleSetRepository {
    private RuleSet: mongoose.Model<mongoose.Document>;

    constructor() {
        this.RuleSet = mongoose.model('RuleSet');
    }

    public create(ruleSetObj: any): Promise<Error | RuleSetModel> {
        return new Promise((resolve, reject) => {
            this.RuleSet.create({
                label: ruleSetObj.label
            }, (error, newRuleSet: RuleSetModel) => {
                if (error) {
                    reject (error);
                    return;
                }

                resolve(newRuleSet);
            });
        });
    }

    public findById(id: string): Promise<RuleSetModel> {
        return this.RuleSet.findById(id);
    }
}