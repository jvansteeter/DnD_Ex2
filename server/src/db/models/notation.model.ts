import { MongooseModel } from './mongoose.model';
import { NotationData } from '../../../../shared/types/encounter/board/notation.data';
import { TextNotationData } from '../../../../shared/types/encounter/board/text-notation.data';
import { NotationVisibility } from '../../../../shared/types/encounter/board/notation-visibility';
import * as mongoose from 'mongoose';
import { XyPair } from '../../../../shared/types/encounter/board/xy-pair';

export class NotationModel extends MongooseModel implements NotationData {
	public _id: string;
	public userId: string;
	public encounterId: string;
	public name: string;
	public iconTag: string;

	public freeformElements: XyPair[][];
	public cellElements: XyPair[];
	public textElements: TextNotationData[];

	public isVisible: boolean;
	public isLocked: boolean;
	public visibilityState: NotationVisibility;

	public red: number;
	public green: number;
	public blue: number;
	public alpha: number;

	constructor() {
		super({
			userId: {type: String, required: true},
			encounterId: {type: String, required: true},
			name: {type: String, default: 'New Notation'},
			iconTag: {type: String, default: 'edit'},
			freeformElements: [],
			cellElements: [],
			textElements: [],
			isVisible: {type: Boolean, default: false},
			isLocked: {type: Boolean, default: false},
			visibilityState: String,
			red: {type: Number, default: 255},
			green: {type: Number, default: 0},
			blue: {type: Number, default: 0},
			alpha: {type: Number, default: 0.3},
		});

		this._id = this.methods._id;
		this.userId = this.methods.userId;
		this.name = this.methods.name;
		this.iconTag = this.methods.iconTag;
		this.freeformElements = this.methods.freeformElements;
		this.cellElements = this.methods.cellElements;
		this.textElements = this.methods.textElements;
		this.isVisible = this.methods.isVisible;
		this.isLocked = this.methods.isLocked;
		this.visibilityState = this.methods.visibilityState;
		this.red = this.methods.red;
		this.green = this.methods.green;
		this.blue = this.methods.blue;
		this.alpha = this.methods.alpha;

		this.methods.setNotationData = this.setNotationData;
	}

	public setNotationData(data: NotationData): Promise<NotationModel> {
		for (let item in data) {
			this[item] = data[item];
		}

		return this.save();
	}
}

mongoose.model('Notation', new NotationModel());
