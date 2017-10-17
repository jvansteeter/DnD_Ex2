import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { CharacterSheetModel } from '../models/characterSheet.model';
import { CharacterAspectRepository } from './characterAspect.repository';
import { RuleFunctionModel } from '../models/ruleFunction.model';

export class RuleFunctionRepository {
    private RuleFunction: mongoose.Model<mongoose.Document>;

    constructor() {
        this.RuleFunction = mongoose.model('RuleFunction');
    }

    public create(ruleFunctionObj: any): Promise<Error | CharacterSheetModel> {
        return new Promise((resolve, reject) => {
            this.RuleFunction.create({
                stack: ruleFunctionObj.stack,
                mapValues: ruleFunctionObj.mapValues,
            }, (error, newRuleFunction: RuleFunctionModel) => {
                if (error) {
                    reject (error);
                    return;
                }

                resolve(newRuleFunction);
            });
        });
    }

    public findById(id: string): Promise<CharacterSheetModel> {
        return new Promise((resolve, reject) => {
            this.RuleFunction.findById(id, (error, ruleFunction: RuleFunctionModel) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(ruleFunction);
            });
        });
    }
}