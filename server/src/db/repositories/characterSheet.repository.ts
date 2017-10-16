import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { CharacterSheetModel } from '../models/characterSheet.model';
import { CharacterAspectRepository } from './characterAspect.repository';

export class CharacterSheetRepository {
    private CharacterSheet: mongoose.Model<mongoose.Document>;
    private characterAspectRepository: CharacterAspectRepository;

    constructor() {
        this.CharacterSheet = mongoose.model('CharacterSheet');
        this.characterAspectRepository = new CharacterAspectRepository();
    }

    public create(ruleSetId: string, label: string): Promise<Error | CharacterSheetModel> {
        return new Promise((resolve, reject) => {
            this.CharacterSheet.create({
                ruleSetId: ruleSetId,
                label: label,
            }, (error, newCharacterSheet: CharacterSheetModel) => {
                if (error) {
                    reject (error);
                    return;
                }
                // let aspectCount = characterSheetObj.aspects.length;
                // characterSheetObj.aspects.forEach((aspectObj) => {
                //     this.characterAspectRepository.create(newCharacterSheet._id, aspectObj).then(newAspect => {
                //        newCharacterSheet.addAspect(newAspect);
                //        aspectCount--;
                //        if (aspectCount === 0) {
                //            resolve(newCharacterSheet);
                //        }
                //     });
                // });

                resolve(newCharacterSheet);
            });
        });
    }

    public findById(id: string): Promise<CharacterSheetModel> {
        return this.CharacterSheet.findById(id);
    }

    public getAllForRuleSet(ruleSetId: string): Promise<CharacterSheetModel[]> {
        return new Promise((resolve, reject) => {
            this.CharacterSheet.find({ruleSetId: ruleSetId}, (error, characterSheets: CharacterSheetModel[]) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(characterSheets);
            });
        });
    }
}