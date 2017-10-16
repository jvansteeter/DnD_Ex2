import * as mongoose from 'mongoose';


export class RuleFunctionModel extends mongoose.Schema {
    public _id: string;
    public stack: string[];
    public mapValues: any;

    constructor() {
        super ({
            stack: [],
            mapValues: Object
        });

        this._id = this.methods._id;
        this.stack = this.methods.stack;
        this.mapValues = this.methods.mapValues;

        this.methods.setStack = this.setStack;
        this.methods.setMapValues = this.setMapValues;
    }

    public setStack(stack: string[]) {
        this.stack = stack;
        this.save();
    }

    public setMapValues(map: any) {
        this.mapValues = map;
        this.save();
    }

    private save() {
        this.methods.save();
    }
}

mongoose.model('RuleFunction', new RuleFunctionModel());