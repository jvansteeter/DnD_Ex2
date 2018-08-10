import * as mongoose from 'mongoose';
import { MongooseModel } from './mongoose.model';
import { AspectData } from '../../../../shared/types/rule-set/aspect.data';
import { AspectType } from '../../../../client/src/app/types/character-sheet/aspect';

export class CharacterAspectModel extends MongooseModel implements AspectData {
	public _id: string;
	public characterSheetId: string;
	public label: string;
	public aspectType: AspectType;
	public required: boolean;
	public isPredefined: boolean;
	public fontSize: number;
	public config: any;
	public items?: any[];
	public ruleFunction?: string;

	constructor() {
		super({
			characterSheetId: String,
			label: String,
			aspectType: String,
			required: Boolean,
			isPredefined: {type: Boolean, default: false },
			fontSize: Number,
			config: {},
			items: [],
			ruleFunction: String,
		});

		this._id = this.methods._id;
		this.characterSheetId = this.methods.characterSheetId;
		this.label = this.methods.label;
		this.aspectType = this.methods.aspectType;
		this.required = this.methods.required;
		this.isPredefined = this.methods.isPredefined;
		this.fontSize = this.methods.fontSize;
		this.config = this.methods.config;
		this.items = this.methods.items;
		this.ruleFunction = this.methods.ruleFunction;

		this.methods.setItems = this.setItems;
		this.methods.setToObject = this.setToObject;
	}

	public setItems(items: any[] | undefined) {
		this.items = items;
		return this.save();
	}

	public setToObject(aspectObj: AspectData): Promise<CharacterAspectModel> {
		this.label = aspectObj.label;
		this.aspectType = aspectObj.aspectType;
		this.required = aspectObj.required;
		this.config = aspectObj.config;
		if (aspectObj.items) {
			this.items = aspectObj.items;
		}
		if (aspectObj.ruleFunction) {
			this.ruleFunction = aspectObj.ruleFunction;
		}
		return this.save();
	}
}

mongoose.model('CharacterAspect', new CharacterAspectModel());