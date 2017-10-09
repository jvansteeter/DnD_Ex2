import * as mongoose from 'mongoose';
import { CharacterAspectModel } from './characterAspect.model';


export class CharacterSheetModel extends mongoose.Schema {
    public _id: string;
    public ruleSetId: string;
    public label: string;
    public aspects: string[];

    constructor() {
        super ({
            ruleSetId: {type: String, required: true},
            label: {type: String, required: true},
            aspects: []
        });

        this._id = this.methods._id;
        this.ruleSetId = this.methods.ruleSetId;
        this.label = this.methods.label;
        this.aspects = this.methods.aspects;

        this.methods.addAspect = this.addAspect;
    }

    public addAspect(aspect: CharacterAspectModel) {
        this.aspects.push(aspect._id);
        this.save();
    }

    private save() {
        this.methods.save();
    }
}

mongoose.model('CharacterSheet', new CharacterSheetModel());