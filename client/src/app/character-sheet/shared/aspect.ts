import { isUndefined } from 'util';
import { AspectData } from "../../../../../shared/types/rule-set/aspect.data";
import { GridsterItem } from 'angular-gridster2';

export enum AspectType {
	TEXT = 'TEXT',
	TEXT_AREA = 'TEXT_AREA',
	NUMBER = 'NUMBER',
	CURRENT_MAX = 'CURRENT_MAX',
	BOOLEAN = 'BOOLEAN',
	BOOLEAN_LIST = 'BOOLEAN_LIST',
	TEXT_LIST = 'TEXT_LIST',
	CATEGORICAL = 'CATEGORICAL',
	FUNCTION = 'FUNCTION',
	CONDITIONS = 'CONDITIONS',
}

export class Aspect implements AspectData {
	_id: string;
	label: string;
	aspectType: AspectType;
	required: boolean;
	isPredefined: boolean;

	fontSize: number;
	items: any[];
	ruleFunction: any;
	characterSheetId: string;

	config: GridsterItem;
	isNew: boolean = true;

	constructor(label: string, aspectType: AspectType, required: boolean, isPredefined?: boolean) {
		this.label = label;
		this.aspectType = aspectType;
		this.required = required;
		this.fontSize = 14;
		this.isPredefined = !isUndefined(isPredefined) ? isPredefined : false;

		this.config = this.defaultConfig();
		switch (aspectType) {
			case AspectType.FUNCTION: {
				this.config.minWidth = 50;
				this.config.minHeight = 50;
				break;
			}
			case AspectType.TEXT_AREA: {
				this.config.resizeY = true;
				this.config.minWidth = 180;
				this.config.minHeight = 50;
				this.config.width = 180;
				this.config.height = 50;
				break;
			}
		}
	}

	equals(aspect: Aspect): boolean {
		return aspect.label.toLowerCase() === this.label.toLowerCase();
	}

	private defaultConfig(): GridsterItem {
		return {
			x: 0,
			y: 0,
			cols: 2,
			rows: 4,
			maxItemCols: 20
		} as GridsterItem;
	}
}
