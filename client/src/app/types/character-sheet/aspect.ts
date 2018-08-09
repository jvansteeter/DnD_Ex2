import { AspectConfig } from './aspect-config';
import { isUndefined } from 'util';

export enum AspectType {
	TEXT = 'TEXT',
	TEXT_AREA = 'TEXT_AREA',
	NUMBER = 'NUMBER',
	BOOLEAN = 'BOOLEAN',
	BOOLEAN_LIST = 'BOOLEAN_LIST',
	TEXT_LIST = 'TEXT_LIST',
	CATEGORICAL = 'CATEGORICAL',
	TOKEN = 'TOKEN',
	FUNCTION = 'FUNCTION'
}

export class Aspect {
	_id: string;
	label: string;
	aspectType: AspectType;
	required: boolean;
	isPredefined: boolean;

	fontSize: number;
	items: any[];
	ruleFunction: any;

	config: AspectConfig;
	isNew: boolean = true;

	constructor(label: string, aspectType: AspectType, required: boolean, isPredefined?: boolean) {
		this.label = label;
		this.aspectType = aspectType;
		this.required = required;
		this.fontSize = 14;
		this.isPredefined = !isUndefined(isPredefined) ? isPredefined : false;

		this.config = this.defaultConfig();
		switch (aspectType) {
			case (AspectType.TOKEN): {
				this.config.resizeY = true;
				this.config.minWidth = 50;
				this.config.minHeight = 50;
				this.config.width = 50;
				this.config.height = 50;
				break;
			}
			case (AspectType.FUNCTION): {
				this.config.minWidth = 50;
				this.config.minHeight = 50;
				break;
			}
			case (AspectType.TEXT_AREA): {
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

	private defaultConfig(): AspectConfig {
		return {
			top: 1,
			left: 1,
			width: 100,
			height: 1,
			resizeY: false,
			minWidth: 1,
			minHeight: 1,
		} as AspectConfig;
	}
}