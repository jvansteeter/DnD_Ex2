export enum AspectType {
    text,
    boolean
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