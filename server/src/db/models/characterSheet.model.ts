import * as mongoose from 'mongoose';
import { CharacterSheetData } from '../../../../shared/types/rule-set/character-sheet.data';
import { MongooseModel } from './mongoose.model';
import { CharacterSheetTooltipData } from '../../../../shared/types/rule-set/character-sheet-tooltip.data';
import { AbilityData } from "../../../../shared/types/ability.data";
import { RuleData } from '../../../../shared/types/rule.data';

export class CharacterSheetModel extends MongooseModel implements CharacterSheetData {
	public _id: string;
	public ruleSetId: string;
	public label: string;
	public tooltipConfig: CharacterSheetTooltipData;
	public rules?: RuleData[];
	public abilities: AbilityData[];

	constructor() {
		super({
			ruleSetId: {type: String, required: true},
			label: {type: String, required: true},
			tooltipConfig: {type: Object, default: {
				aspects: []
			}},
			rules: {type: Array, of: Object, default: []},
			abilities: [{
				name: String,
				range: Number,
				rolls: [{
					name: String,
					equation: String,
				}]
			}],
		});

		this._id = this.methods._id;
		this.ruleSetId = this.methods.ruleSetId;
		this.label = this.methods.label;
		this.tooltipConfig = this.methods.tooltipConfig;
		this.rules = this.methods.rules;
		this.abilities = this.methods.abilities;

		this.methods.setTooltipConfig = this.setTooltipConfig;
		this.methods.setAbilities = this.setAbilities;
		this.methods.setRules = this.setRules;
	}

	public setTooltipConfig(config: any): Promise<CharacterSheetModel> {
		this.tooltipConfig = config;
		return this.save();
	}

	public setAbilities(abilities: AbilityData[]): Promise<CharacterSheetModel> {
		this.abilities = abilities;
		return this.save();
	}

	public setRules(rules: RuleData[]): Promise<CharacterSheetModel> {
		this.rules = rules;
		return this.save();
	}
}

mongoose.model('CharacterSheet', new CharacterSheetModel());