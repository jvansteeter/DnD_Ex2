import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';


export class CharacterSheetModel extends mongoose.Schema {
    public _id: string;
    public ruleSetId: string;
    public label: string;
    public height: number;

    constructor() {
        super ({
            ruleSetId: {type: String, required: true},
            label: {type: String, required: true},
            height: Number
        });

        this._id = this.methods._id;
        this.ruleSetId = this.methods.ruleSetId;
        this.label = this.methods.label;
        this.height = this.methods.height;

        this.methods.setHeight = this.setHeight;
    }

    public setHeight(height: number): Promise<void> {
        this.height = height;
        return this.save();
    }

    private save(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.methods.save((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    }
}

mongoose.model('CharacterSheet', new CharacterSheetModel());