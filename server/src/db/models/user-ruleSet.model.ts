import * as mongoose from 'mongoose';

export class UserRuleSetModel extends mongoose.Schema {
    public _id: string;
    public userId: string;
    public ruleSetId: string;

    constructor() {
        super ({
            userId: {type: String, required: true},
            ruleSetId: {type: String, required: true}
        });

        this._id = this.methods._id;
        this.userId = this.methods.userId;
        this.ruleSetId = this.methods.ruleSetId;
    }

    private save() {
        this.methods.save();
    }
}

mongoose.model('User_RuleSet', new UserRuleSetModel());