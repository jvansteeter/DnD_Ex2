import { AspectConfig } from './aspect-config';

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

    fontSize: number;
    items: any[];
    ruleFunction: any;

    config: AspectConfig;
    isNew: boolean = true;

    constructor(label: string, aspectType: AspectType, required: boolean) {
        this.label = label;
        this.aspectType = aspectType;
        this.required = required;
        this.fontSize = 14;

        this.config = this.defaultConfig();
        switch (aspectType) {
	        case (AspectType.TOKEN): {
	        	this.config.resizeY = true;
	        	this.config.minWidth = 20;
	        	this.config.minHeight = 20;
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
	        }
        }
    }

    equals(aspect: Aspect): boolean {
    	return aspect._id === this._id;
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