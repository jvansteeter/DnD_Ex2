import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { CharacterAspectModel } from '../models/characterAspect.model';

export class CharacterAspectRepository {
    private CharacterAspect: mongoose.Model<mongoose.Document>;

    constructor() {
        this.CharacterAspect = mongoose.model('CharacterAspect');
    }

    public create(characterSheetId: string, characterAspectObj: any): Promise<Error | CharacterAspectModel> {
        return new Promise((resolve, reject) => {
            this.CharacterAspect.create({
                characterSheetId: characterSheetId,
                label: characterAspectObj.label,
                aspectType: characterAspectObj.aspectType,
                required: characterAspectObj.required,
                top: characterAspectObj.top,
                left: characterAspectObj.left,
                width: characterAspectObj.width,
                height: characterAspectObj.height
            }, (error, newCharacterAspect: CharacterAspectModel) => {
                if (error) {
                    reject (error);
                    return;
                }
                if (characterAspectObj.hasOwnProperty('items')) {
                    newCharacterAspect.setItems(characterAspectObj.items);
                }

                resolve(newCharacterAspect);
            });
        });
    }

    public findById(id: string): Promise<CharacterAspectModel> {
        return this.CharacterAspect.findById(id);
    }
}