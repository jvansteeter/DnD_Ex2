import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { RuleSetModel } from '../models/ruleSet.model';
import { UserModel } from '../models/user.model';

export class RuleSetRepository {
    private RuleSet: mongoose.Model<mongoose.Document>;

    constructor() {
        this.RuleSet = mongoose.model('RuleSet');
    }

    public create(label: string, user: UserModel): Promise<Error | RuleSetModel> {
        return new Promise((resolve, reject) => {
            this.RuleSet.create({
                label: label
            }, (error, newRuleSet: RuleSetModel) => {
                if (error) {
                    reject (error);
                    return;
                }

                newRuleSet.addAdmin(user._id, 'superuser');

                resolve(newRuleSet);
            });
        });
    }

    public findById(id: string): Promise<RuleSetModel> {
        return this.RuleSet.findById(id);
    }
}