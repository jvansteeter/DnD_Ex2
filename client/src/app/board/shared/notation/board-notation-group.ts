import {XyPair} from "../../../../../../shared/types/encounter/board/xy-pair";
import { NotationVisibility } from "../../../../../../shared/types/encounter/board/notation-visibility";
import { ColorStatics } from "../../statics/color-statics";
import { TextNotation } from "./text-notation";
import { NotationData } from '../../../../../../shared/types/encounter/board/notation.data';
import { ConcurrentBoardObject } from '../../../encounter/concurrent-board-object';

export class BoardNotationGroup extends ConcurrentBoardObject implements NotationData {
	public _id: string;
	public encounterId: string;
	public userId: string;
	public name = 'Notation';
	public iconTag = 'edit';

	public freeformElements: Array<Array<XyPair>>;
	public cellElements: Array<XyPair>;
	public textElements: Array<TextNotation>;

	public isVisible = false;
	public isLocked = false;
	public visibilityState = NotationVisibility.FULL;

	red = 255;
	green = 0;
	blue = 0;
	alpha = 1.0;

	constructor(data: NotationData) {
		super();
		this.setNotationData(data);
	}

	public setNotationData(notationData: NotationData): void {
		for (let item in notationData) {
			if (item === 'freeformElements') {
				this.freeformElements = [];
				const freeformElements = notationData[item];
				for (let array of freeformElements) {
					const newArray = [];
					for (let pair of array) {
						let newPair = new XyPair(pair.x, pair.y);
						newArray.push(newPair);
					}
					this.freeformElements.push(newArray);
				}
			}
			else if (item === 'cellElements') {
				this.cellElements = [];
				for (let pair of notationData[item]) {
					this.cellElements.push(new XyPair(pair.x, pair.y));
				}
			}
			else {
				this[item] = notationData[item];
			}
		}
	}

	public toggleVisible() {
		this.isVisible = !this.isVisible;
		this.emitChange();
	}

	public toggleLocked() {
		this.isLocked = !this.isLocked;
		this.emitChange();
	}

	public toggleVisibility() {
		switch (this.visibilityState) {
			case NotationVisibility.FULL:
				this.visibilityState = NotationVisibility.PARTIAL;
				break;
			case NotationVisibility.PARTIAL:
				this.visibilityState = NotationVisibility.OFF;
				break;
			case NotationVisibility.OFF:
				this.visibilityState = NotationVisibility.FULL;
				break;
		}
		this.emitChange();
	}

	public getRgbCode(): string {
		return 'rgb(' + this.red + ', ' + this.green + ', ' + this.blue + ')';
	}

	public getRgbaCode() {
		return 'rgba(' + this.red + ', ' + this.green + ', ' + this.blue + ', ' + this.alpha + ')';
	}

	public setRgba(r: number, g: number, b: number, a: number) {
		this.red = r;
		this.green = g;
		this.blue = b;
		this.alpha = a;
		this.emitChange();
	}

	public setRgbaWithString(rgbaString: string) {
		const useThese = ColorStatics.parseRgbaString(rgbaString);
		this.red = useThese[0];
		this.green = useThese[1];
		this.blue = useThese[2];
		this.alpha = useThese[3];
		this.emitChange();
	}

	public startNewFreeform() {
		this.freeformElements.push(new Array<XyPair>());
		this.emitChange();
	}

	public appendToFreeform(point: XyPair) {
		this.freeformElements[this.freeformElements.length - 1].push(point);
		this.emitChange();
	}

	public toggleCell(cell: XyPair) {
		let i = this.cellPresent(cell);
		if (i !== -1) {
			this.cellElements.splice(i, 1);
			return;
		}
		this.cellElements.push(cell);
	}

	public addCell(cell: XyPair) {
		let i = this.cellPresent(cell);
		if (i === -1) {
			this.cellElements.push(cell);
		}
		this.emitChange();
	}

	public addBatchCells(cells: Array<XyPair>) {
		for (let cell of cells) {
			let i = this.cellPresent(cell);
			if (i === -1) {
				this.cellElements.push(cell);
			}
		}
		this.emitChange();
	}

	public removeCell(cell: XyPair) {
		const i = this.cellPresent(cell);
		if (i !== -1) {
			this.cellElements.splice(i, 1);
		}
	}

	private cellPresent(cell: XyPair): number {
		let i = 0;
		for (let test_cell of this.cellElements) {
			if (test_cell.hash() === cell.hash()) {
				return i;
			}
			i++;
		}
		return -1;
	}

	public addTextNotation(textNotation: TextNotation) {
		this.textElements.push(textNotation);
		this.emitChange();
	}

	public getTextNotation(id: string): TextNotation {
		for (let textEl of this.textElements) {
			if (textEl._id === id) {
				return textEl;
			}
		}
	}

	public emitChange(): void {
		super.emitChange(JSON.stringify({
			_id: this._id,
			encounterId: this.encounterId,
			userId: this.userId,
			name: this.name,
			iconTag: this.iconTag,
			freeformElements: this.freeformElements,
			cellElements: this.cellElements,
			textElements: this.textElements,
			isVisible: this.isVisible,
			isLocked: this.isLocked,
			visibilityState: this.visibilityState,
			red: this.red,
			green: this.green,
			blue: this.blue,
			alpha: this.alpha,
		} as NotationData));
	}
}