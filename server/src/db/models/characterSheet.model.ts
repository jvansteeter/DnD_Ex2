import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';


export class CharacterSheetModel extends mongoose.Schema {
    public _id: string;
    public ruleSetId: string;
    public label: string;
    public aspects: string[];

    constructor() {
        super ({
            ruleSetId: {type: String, required: true},
            label: {type: String, required: true}
        });

        this._id = this.methods._id;
        this.ruleSetId = this.methods.ruleSetId;
        this.label = this.methods.label;
        this.aspects = this.methods.aspects;
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