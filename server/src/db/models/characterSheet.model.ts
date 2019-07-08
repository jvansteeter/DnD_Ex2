import * as mongoose from 'mongoose';
import { CharacterSheetData } from '../../../../shared/types/rule-set/character-sheet.data';
import { MongooseModel } from './mongoose.model';
import { CharacterSheetTooltipData } from '../../../../shared/types/rule-set/character-sheet-tooltip.data';
import { AbilityData } from "../../../../shared/types/ability.data";

export class CharacterSheetModel extends MongooseModel implements CharacterSheetData {
	public _id: string;
	public ruleSetId: string;
	public label: string;
	public tooltipConfig: CharacterSheetTooltipData;
	public rules: string[];

	constructor() {
		super({
			ruleSetId: {type: String, required: true},
			label: {type: String, required: true},
			tooltipConfig: {type: Object, default: {
				aspects: []
			}},
			rules: {type: Array, default: []},
		});

		this._id = this.methods._id;
		this.ruleSetId = this.methods.ruleSetId;
		this.label = this.methods.label;
		this.tooltipConfig = this.methods.tooltipConfig;
		this.rules = this.methods.rules;

		this.methods.setTooltipConfig = this.setTooltipConfig;
	}

	public setTooltipConfig(config: any): Promise<CharacterSheetModel> {
		this.tooltipConfig = config;
		return this.save();
	}
}

mongoose.model('CharacterSheet', new CharacterSheetModel());