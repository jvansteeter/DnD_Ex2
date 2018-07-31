import { AspectConfig } from './aspect-config';

export enum AspectType {
    TEXT = 'TEXT',
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
	        	break;
	        }
	        case (AspectType.FUNCTION): {
	        	this.config.minWidth = 50;
	        	this.config.minHeight = 50;
	        	break;
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
	        width: 200,
	        height: 100,
	        resizeY: false,
	        minWidth: 100,
	        minHeight: 100,
        } as AspectConfig;
    }
}