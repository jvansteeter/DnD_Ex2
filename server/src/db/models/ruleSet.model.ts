import * as mongoose from 'mongoose';
import { MongooseModel } from './mongoose.model';
import { RuleSetData } from '../../../../shared/types/rule-set/rule-set.data';
import { RuleSetModulesConfigData } from '../../../../shared/types/rule-set/rule-set-modules-config.data';
import { DamageTypeData } from '../../../../shared/types/rule-set/damage-type.data';

export class RuleSetModel extends MongooseModel implements RuleSetData {
	public _id: string;
	public label: string;
	public admins: any[];
	public modulesConfig: RuleSetModulesConfigData;
	public damageTypes?: DamageTypeData[];

	constructor() {
		super({
			label: {type: String, required: true},
			admins: [{
				userId: String,
				role: String
			}],
			modulesConfig: {type: Object, default: {}},
			damageTypes: {type: Array, of: Object},
		});

		this._id = this.methods._id;
		this.label = this.methods.label;
		this.admins = this.methods.admins;
		this.modulesConfig = this.methods.modulesConfig;
		this.damageTypes = this.methods.damageTypes;

		this.methods.addAdmin = this.addAdmin;
		this.methods.setConfig = this.setConfig;
		this.methods.setDamageTypes = this.setDamageTypes;
	}

	public addAdmin(userId: string, role: string): Promise<RuleSetModel> {
		this.admins.push({userId: userId, role: role});
		return this.save();
	}

	public setConfig(config: RuleSetModulesConfigData): Promise<RuleSetModel> {
		this.modulesConfig = config;
		return this.save();
	}

	public setDamageTypes(types: DamageTypeData[]): Promise<RuleSetModel> {
		this.damageTypes = types;
		return this.save();
	}
}

mongoose.model('RuleSet', new RuleSetModel());