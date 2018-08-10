import * as mongoose from 'mongoose';
import { CharacterSheetModel } from './characterSheet.model';
import { MongooseModel } from './mongoose.model';
import { RuleSetData } from '../../../../shared/types/rule-set/rule-set.data';
import { RuleSetConfigData } from '../../../../shared/types/rule-set/rule-set-config.data';


export class RuleSetModel extends MongooseModel implements RuleSetData {
	public _id: string;
	public label: string;
	public characterSheets: any[];
	public admins: any[];
	public config: RuleSetConfigData;

	constructor() {
		super({
			label: {type: String, required: true},
			characterSheets: [],
			admins: [{
				userId: String,
				role: String
			}],
			config: {type: Object, default: {}}
		});

		this._id = this.methods._id;
		this.label = this.methods.label;
		this.characterSheets = this.methods.characterSheets;
		this.admins = this.methods.admins;

		this.methods.addCharacterSheet = this.addCharacterSheet;
		this.methods.addAdmin = this.addAdmin;
	}

	public addCharacterSheet(sheet: CharacterSheetModel): void {
		this.characterSheets.push(sheet._id);
		this.save();
	}

	public addAdmin(userId: string, role: string) {
		this.admins.push({userId: userId, role: role});
		this.save();
	}
}

mongoose.model('RuleSet', new RuleSetModel());