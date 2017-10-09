import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { CharacterSheetModel } from '../models/characterSheet.model';

export class CharacterSheetRepository {
    private CharacterSheet: mongoose.Model<mongoose.Document>;

    constructor() {
        this.CharacterSheet = mongoose.model('CharacterSheet');
    }

    public create(label: string, ruleSetId: string, characterAspects: any[]): Promise<Error | CharacterSheetModel> {
        return new Promise((resolve, reject) => {
            this.CharacterSheet.create({
                ruleSetId: ruleSetId,
                label: label,
                aspects: characterAspects
            }, (error, newCharacterSheet: CharacterSheetModel) => {
                if (error) {
                    reject (error);
                    return;
                }

                resolve(newCharacterSheet);
            });
        });
    }

    public findById(id: string): Promise<CharacterSheetModel> {
        return this.CharacterSheet.findById(id);
    }
}