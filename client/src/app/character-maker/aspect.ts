export enum AspectType {
    TEXT,
    NUMBER,
    BOOLEAN,
    BOOLEAN_LIST,
    TEXT_LIST,
    CATEGORICAL,
    TOKEN,
    FUNCTION
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