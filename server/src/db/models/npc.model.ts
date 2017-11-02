import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';


export class NpcModel extends mongoose.Schema {
    public _id: string;
    public label: string;
    public characterSheetId: string;
    public ruleSetId: string;
    public values: any[];

    constructor() {
        super ({
            label: {type: String, required: true},
            characterSheetId: String,
            ruleSetId: String,
            values: []
        });

        this._id = this.methods._id;
        this.label = this.methods.label;
        this.characterSheetId = this.methods.characterSheetId;
        this.ruleSetId = this.methods.ruleSetId;
        this.values = this.methods.values;

        this.methods.setRuleSetId = this.setRuleSetId;
        this.methods.setValues = this.setValues;
    }

    public setRuleSetId(id: string): Promise<void> {
        this.ruleSetId = id;
        return this.save();
    }

    public setValues(values: any[]): Promise<void> {
        this.values = values;
        return this.save();
    }

    private save(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.methods.save((error, npc: NpcModel) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(npc);
            })
        });
    }
}

mongoose.model('NPC', new NpcModel());