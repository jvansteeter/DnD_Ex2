import * as mongoose from 'mongoose';


export class RuleSetModel extends mongoose.Schema {
    public _id: string;
    public label: string;
    public characterSheets: any[];
    public admins: any[];

    constructor() {
        super ({
            label: String,
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
    }

    public addCharacterSheet(sheet: any): void {
        this.characterSheets.push(sheet);
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