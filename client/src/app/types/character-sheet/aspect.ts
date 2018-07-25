
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

    // config: NgGridItemConfig;
    isNew: boolean = true;

    constructor(label: string, aspectType: AspectType, required: boolean) {
        this.label = label;
        this.aspectType = aspectType;
        this.required = required;
        this.fontSize = 14;

        // this.config = this.defaultConfig();
    }

    // private defaultConfig(): NgGridItemConfig {
    //     return { 'dragHandle': '.sub-component-header', 'col': 1, 'row': 1, 'sizex': 15, 'sizey': 5 } as NgGridItemConfig;
    // }
}