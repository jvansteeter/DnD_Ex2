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
    options: any;

    constructor(label: string, aspectType: AspectType, required: boolean, options?: any) {
        this.label = label;
        this.aspectType = aspectType;
        this.required = required;
        this.options = options;
    }
}