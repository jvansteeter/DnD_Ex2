import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { UserRepository } from './user.repository';
import { NpcModel } from '../models/npc.model';

export class NpcRepository {
    private Npc: mongoose.Model<mongoose.Document>;

    private userRepository: UserRepository;

    constructor() {
        this.Npc = mongoose.model('NPC');
        this.userRepository = new UserRepository();
    }

    public create(label: string, characterSheetId: string): Promise<Error | NpcModel> {
        return new Promise((resolve, reject) => {
            this.Npc.create({
                label: label,
                characterSheetId: characterSheetId
            }, (error, npc: NpcModel) => {
                if (error) {
                    reject (error);
                    return;
                }

                resolve(npc);
            });
        });
    }

    public findById(id: string): Promise<NpcModel> {
        return new Promise((resolve, reject) => {
            this.Npc.findById(id, (error, ruleSet) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(ruleSet);
            })
        });
    }

    public findAllForRuleSet(ruleSetId: string): Promise<NpcModel[]> {
        return new Promise((resolve, reject) => {
            this.Npc.find({ruleSetId: ruleSetId}, (error, npcs: NpcModel[]) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(npcs);
            });
        });
    }
}
