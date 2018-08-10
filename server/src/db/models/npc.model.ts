import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { MongooseModel } from './mongoose.model';
import { CharacterData } from '../../../../shared/types/character.data';
import { CharacterSheetData } from '../../../../shared/types/rule-set/character-sheet.data';

export class NpcModel extends MongooseModel implements CharacterData {
	public _id: string;
	public label: string;
	public characterSheetId: string;
	public characterSheet?: CharacterSheetData;
	public ruleSetId: string;
	public values: any[];

	constructor() {
		super({
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
}

mongoose.model('NPC', new NpcModel());