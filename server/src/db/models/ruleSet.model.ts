import * as mongoose from 'mongoose';
import { MongooseModel } from './mongoose.model';
import { RuleSetData } from '../../../../shared/types/rule-set/rule-set.data';
import { RuleSetConfigData } from '../../../../shared/types/rule-set/rule-set-config.data';


export class RuleSetModel extends MongooseModel implements RuleSetData {
	public _id: string;
	public label: string;
	public admins: any[];
	public config: RuleSetConfigData;

	constructor() {
		super({
			label: {type: String, required: true},
			admins: [{
				userId: String,
				role: String
			}],
			config: {type: Object, default: {}}
		});

		this._id = this.methods._id;
		this.label = this.methods.label;
		this.admins = this.methods.admins;

		this.methods.addAdmin = this.addAdmin;
		this.methods.setConfig = this.setConfig;
	}

	public addAdmin(userId: string, role: string): Promise<RuleSetModel> {
		this.admins.push({userId: userId, role: role});
		return this.save();
	}

	public setConfig(config: any): Promise<RuleSetModel> {
		this.config = config;
		return this.save();
	}
}

mongoose.model('RuleSet', new RuleSetModel());