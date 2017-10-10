import * as mongoose from 'mongoose';
import { CharacterSheetModel } from './characterSheet.model';


export class RuleSetModel extends mongoose.Schema {
    public _id: string;
    public label: string;
    public characterSheets: any[];
    public admins: any[];

    constructor() {
        super ({
            label: {type: String, required: true},
            characterSheets: [],
            admins: [{
                userId: String,
                role: String
            }]
        });

        this._id = this.methods._id;
        this.label = this.methods.label;
        this.characterSheets = this.methods.characterSheets;
        this.admins = this.methods.admins;

        this.methods.addCharacterSheet = this.addCharacterSheet;
        this.methods.addAdmin = this.addAdmin;
    }

    public addCharacterSheet(sheet: CharacterSheetModel): void {
        this.characterSheets.push(sheet._id);
        this.save();
    }

    public addAdmin(userId: string, role: string) {
        this.admins.push({userId: userId, role: role});
        this.save();
    }

    private save() {
        this.methods.save();
    }
}

mongoose.model('RuleSet', new RuleSetModel());