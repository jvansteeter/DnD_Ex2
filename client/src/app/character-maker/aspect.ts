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
    label: string;
    aspectType: AspectType;
    required: boolean;
    // options: any;

    top: number;
    left: number;
    width: number;
    height: number;
    items: any[];
    ruleFunction: any;

    isNew: boolean = true;

    constructor(label: string, aspectType: AspectType, required: boolean) {
        this.label = label;
        this.aspectType = aspectType;
        this.required = required;
        // this.options = options;
        this.top = 0;
        this.left = 0;
    }
}