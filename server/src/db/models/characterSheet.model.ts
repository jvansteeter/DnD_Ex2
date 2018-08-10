import * as mongoose from 'mongoose';
import { CharacterSheetData } from '../../../../shared/types/character-sheet.data';
import { MongooseModel } from './mongoose.model';
import { CharacterSheetTooltipData } from '../../../../shared/types/character-sheet-tooltip.data';

export class CharacterSheetModel extends MongooseModel implements CharacterSheetData {
	public _id: string;
	public ruleSetId: string;
	public label: string;
	public tooltipConfig: CharacterSheetTooltipData;

	constructor() {
		super({
			ruleSetId: {type: String, required: true},
			label: {type: String, required: true},
			tooltipConfig: Object
		});

		this._id = this.methods._id;
		this.ruleSetId = this.methods.ruleSetId;
		this.label = this.methods.label;
		this.tooltipConfig = this.methods.tooltipConfig;
	}
}

mongoose.model('CharacterSheet', new CharacterSheetModel());