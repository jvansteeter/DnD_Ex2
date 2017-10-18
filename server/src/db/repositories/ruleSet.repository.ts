import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { RuleSetModel } from '../models/ruleSet.model';
import { UserModel } from '../models/user.model';
import { UserRepository } from './user.repository';

export class RuleSetRepository {
    private RuleSet: mongoose.Model<mongoose.Document>;

    private userRepository: UserRepository;

    constructor() {
        this.RuleSet = mongoose.model('RuleSet');
        this.userRepository = new UserRepository();
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
        return new Promise((resolve, reject) => {
            this.RuleSet.findById(id, (error, ruleSet) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(ruleSet);
            })
        });
    }

    public getAdmins(ruleSetId: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.findById(ruleSetId).then((ruleSet: RuleSetModel) => {
                let admins: any[] = [];
                let adminCount = ruleSet.admins.length;
                ruleSet.admins.forEach((admin: any) => {
                    this.userRepository.findById(admin.userId).then((user: UserModel) => {
                         admins.push({username: user.username, role: admin.role});
                         if (--adminCount === 0) {
                             resolve(admins);
                         }
                    });
                });
            }).catch(error => reject(error));
        });
    }
}