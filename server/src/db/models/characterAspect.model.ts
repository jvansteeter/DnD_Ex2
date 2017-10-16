import * as mongoose from 'mongoose';
import { RuleFunctionModel } from './ruleFunction.model';


export class CharacterAspectModel extends mongoose.Schema {
    public _id: string;
    public characterSheetId: string;
    public label: string;
    public aspectType: string;
    public required: boolean;
    public top: number;
    public left: number;
    public width: number;
    public height: number;
    public items: any[];
    public ruleFunction: string;

    constructor() {
        super ({
            characterSheetId: String,
            label: String,
            aspectType: String,
            required: Boolean,
            top: Number,
            left: Number,
            width: Number,
            height: Number,
            items: [],
            ruleFunction: String
        });

        this._id = this.methods._id;
        this.characterSheetId = this.methods.characterSheetId;
        this.label = this.methods.label;
        this.aspectType = this.methods.aspectType;
        this.required = this.methods.required;
        this.top = this.methods.top;
        this.left = this.methods.left;
        this.width = this.methods.width;
        this.height = this.methods.height;
        this.items = this.methods.items;
        this.ruleFunction = this.methods.ruleFunction;

        this.methods.setItems = this.setItems;
        this.methods.setRuleFunction = this.setRuleFunction;
    }

    public setItems(items: any[]) {
        this.items = items;
        this.save();
    }

    public setRuleFunction(ruleFunction: RuleFunctionModel) {
        this.ruleFunction = ruleFunction._id;
        this.save();
    }

    private save() {
        this.methods.save();
    }
}

mongoose.model('CharacterAspect', new CharacterAspectModel());