import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { CharacterAspectModel } from '../models/characterAspect.model';
import { RuleFunctionRepository } from './ruleFunction.repository';
import { RuleFunctionModel } from '../models/ruleFunction.model';

export class CharacterAspectRepository {
    private CharacterAspect: mongoose.Model<mongoose.Document>;
    private ruleFunctionRepository: RuleFunctionRepository;

    constructor() {
        this.CharacterAspect = mongoose.model('CharacterAspect');
        this.ruleFunctionRepository = new RuleFunctionRepository();
    }

    public create(characterSheetId: string, characterAspectObj: any): Promise<Error | CharacterAspectModel> {
        return new Promise((resolve, reject) => {
            this.CharacterAspect.create({
                characterSheetId: characterSheetId,
                label: characterAspectObj.label,
                aspectType: characterAspectObj.aspectType,
                required: characterAspectObj.required,
                fontSize: characterAspectObj.fontSize,
                config: characterAspectObj.config
            }, (error, newCharacterAspect: CharacterAspectModel) => {
                if (error) {
                    reject (error);
                    return;
                }
                if (characterAspectObj.hasOwnProperty('items')) {
                    newCharacterAspect.setItems(characterAspectObj.items);
                }
                if (characterAspectObj.hasOwnProperty('functionGrammar')) {
                    this.ruleFunctionRepository.create(characterAspectObj.functionGrammar).then((newRuleFunction: RuleFunctionModel) => {
                        newCharacterAspect.setRuleFunction(newRuleFunction);
                        resolve(newCharacterAspect);
                    });
                }
                else {
                    resolve(newCharacterAspect);
                }
            });
        });
    }

    public findById(id: string): Promise<CharacterAspectModel> {
        return new Promise((resolve, reject) => {
            this.CharacterAspect.findById(id, (error, characterAspect: CharacterAspectModel) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(characterAspect);
            });
        });
    }

    public update(aspectObj: any): Promise<CharacterAspectModel> {
        return new Promise((resolve, reject) => {
            this.findById(aspectObj._id).then((aspect: CharacterAspectModel) => {
                aspect.setToObject(aspectObj).then((newAspect) => {
                    resolve(newAspect);
                }).catch((error) => reject(error));
            }).catch((error) => reject(error));
        });
    }

    public findByCharacterSheetId(id: string): Promise<CharacterAspectModel[]> {
        return new Promise((resolve, reject) => {
            this.CharacterAspect.find({characterSheetId: id}, (error, aspects: CharacterAspectModel[]) => {
                if (error) {
                    reject(error);
                    return;
                }
                aspects.sort(this.orderByConfigCol);

                resolve(aspects);
            });
        });
    }

    public removeByCharacterSheetId(id: string): Promise<CharacterAspectModel[]> {
        return new Promise((resolve, reject) => {
            this.CharacterAspect.remove({characterSheetId: id}, (error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    }

    public deleteById(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.CharacterAspect.remove({_id: id}, (error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            })
        })
    }

    private orderByConfigCol(a, b): number {
        if (a.config.row < b.config.row) {
            return -1;
        }
        else if (a.config.row > b.config.row) {
            return 1;
        }

        return 0;
    }
}