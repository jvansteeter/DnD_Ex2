import { CharacterMakerService } from '../../character-maker.service';

export enum GrammarNode {
    START = 'START',
    IF = 'IF',
    THEN = 'THEN',
    THIS = 'THIS',
    ASPECT = 'ASPECT',
    ASPECT_BOOLEAN = 'ASPECT_BOOLEAN',
    ASPECT_BOOLEAN_LIST = 'ASPECT_BOOLEAN_LIST',
    ASPECT_BOOLEAN_LIST_ITEM = 'ASPECT_BOOLEAN_LIST_ITEM',
    ASPECT_BOOLEAN_THEN = 'ASPECT_BOOLEAN_THEN',
    ASPECT_NUMBER_THEN = 'ASPECT_NUMBER_THEN',
    ASPECT_NUMBER = 'ASPECT_NUMBER',
    OPERATOR = 'OPERATOR',
    LOGIC_OPERATOR = 'LOGIC_OPERATOR',
    EQUAL_OR_NOT = 'EQUAL_OR_NOT',
    ASSIGNED = 'ASSIGNED',
    NUMBER = 'NUMBER',
    BOOLEAN = 'BOOLEAN',
    ASSIGNED_NUMBER = 'ASSIGNED_NUMBER',
    ASSIGNED_ASPECT_NUMBER = 'ASSIGNED_ASPECT_NUMBER',
    ASSIGNED_ASPECT_NUMBER_FIRST = 'ASSIGNED_ASPECT_NUMBER_FIRST',
    ASSIGNED_BOOLEAN = 'ASSIGNED_BOOLEAN',
    ASSIGNED_ASPECT_BOOLEAN = 'ASSIGNED_ASPECT_BOOLEAN',
    ASSIGNED_OPERATOR = 'ASSIGNED_OPERATOR',
    IF_NOT = 'IF_NOT',
    DONE = 'DONE'
}

interface FunctionData {
    index: number,
    pendingOperator: any,
    pendingLogicOperator: any,
    condition: boolean,
    pendingConditionalValue: any,
    operationalConditionalValue: any,
    value: any
}

export class FunctionGrammar {
    private grammar = {
        'START': [
            GrammarNode.IF,
            GrammarNode.THIS
        ],
        'IF': [
            GrammarNode.ASPECT
        ],
        'THEN': [
            GrammarNode.IF,
            GrammarNode.THIS
        ],
        'THIS': [
            GrammarNode.ASSIGNED
        ],
        'ASPECT': [
        ],
        'ASPECT_BOOLEAN': [
            GrammarNode.EQUAL_OR_NOT
        ],
        'ASPECT_BOOLEAN_LIST': [
            GrammarNode.ASPECT_BOOLEAN_LIST_ITEM
        ],
        'ASPECT_BOOLEAN_LIST_ITEM': [
            GrammarNode.EQUAL_OR_NOT
        ],
        'ASPECT_BOOLEAN_THEN': [
            GrammarNode.THEN
        ],
        'ASPECT_NUMBER': [
            GrammarNode.LOGIC_OPERATOR
        ],
        'ASPECT_NUMBER_THEN': [
            GrammarNode.OPERATOR,
            GrammarNode.THEN
        ],
        'OPERATOR': [
            GrammarNode.ASPECT_NUMBER_THEN,
            GrammarNode.NUMBER
        ],
        'LOGIC_OPERATOR': [
            GrammarNode.NUMBER,
            GrammarNode.ASPECT_NUMBER_THEN
        ],
        'EQUAL_OR_NOT': [
            GrammarNode.BOOLEAN,
            GrammarNode.ASPECT_BOOLEAN_THEN,
        ],
        'ASSIGNED': [
            GrammarNode.ASPECT,
            GrammarNode.ASSIGNED_NUMBER,
            GrammarNode.ASSIGNED_BOOLEAN
        ],
        'NUMBER': [
            GrammarNode.OPERATOR,
            GrammarNode.THEN
        ],
        'BOOLEAN': [
            GrammarNode.THEN
        ],
        'ASSIGNED_NUMBER': [
            GrammarNode.ASSIGNED_OPERATOR,
            GrammarNode.IF_NOT,
            GrammarNode.DONE
        ],
        'ASSIGNED_ASPECT_NUMBER': [
            GrammarNode.ASSIGNED_OPERATOR,
            GrammarNode.IF_NOT,
            GrammarNode.DONE
        ],
        'ASSIGNED_ASPECT_NUMBER_FIRST': [
            GrammarNode.ASSIGNED_OPERATOR,
            GrammarNode.IF_NOT,
            GrammarNode.DONE
        ],
        'ASSIGNED_BOOLEAN': [
            GrammarNode.IF_NOT,
            GrammarNode.DONE
        ],
        'ASSIGNED_ASPECT_BOOLEAN': [
            GrammarNode.IF_NOT,
            GrammarNode.DONE
        ],
        'ASSIGNED_OPERATOR': [
            GrammarNode.ASSIGNED_NUMBER,
            GrammarNode.ASSIGNED_ASPECT_NUMBER
        ],
        'IF_NOT': [
            GrammarNode.IF,
            GrammarNode.THIS
        ]
    };

    public stack: GrammarNode[];
    private mapValues = {};
    private currentIndex: number;

    constructor(private characterMakerService: CharacterMakerService) {
        this.stack = [];
        this.currentIndex = -1;
    }

    public push(nextNode: GrammarNode): void {
        this.stack.push(nextNode);
        this.currentIndex++;
    }

    public setCurrentValue(value: any): void {
        this.mapValues[this.currentIndex] = value;
    }

    public pop(): GrammarNode | undefined {
        this.currentIndex--;
        return this.stack.pop();
    }

    public start(): void {
        this.stack = [];
        this.stack.push(GrammarNode.START);
        this.currentIndex = 0;
    }

    public currentNode(): GrammarNode {
        return this.stack[this.currentIndex];
    }

    public previousNode(): GrammarNode {
        return this.stack[this.currentIndex - 1];
    }

    public nextOptions(): GrammarNode[] {
        return this.grammar[this.stack[this.currentIndex]];
    }

    public getValue(): any{
        let data = {
            index: 0,
            pendingOperator: null,
            pendingLogicOperator: null,
            condition: true,
            pendingConditionalValue: null,
            operationalConditionalValue: null,
            value: 0
        };
        try {
            this._start(data);
        }
        catch (error) {
            console.error(error);
            return 'NaN';
        }

        return data.value;
    }

    private _start(data: FunctionData): void {
        console.log(this.stack)
        console.log('_start')
        console.log(JSON.parse(JSON.stringify(data)))
        if (this.stack[0] !== GrammarNode.START) {
            throw new Error('Invalid Grammar');
        }
        let next = this.stack[++data.index];
        if (next === GrammarNode.IF) {
            this._if(data);
            return;
        }
        else if (next === GrammarNode.THIS) {
            this._this(data);
            return;
        }

        throw new Error('Invalid Grammar');
    }

    private _if(data: FunctionData) {
        console.log('_if')
        console.log(JSON.parse(JSON.stringify(data)))

        let next = this.stack[++data.index];
        if (next === GrammarNode.ASPECT) {
            next = this.stack[++data.index];
            if (next === GrammarNode.ASPECT_BOOLEAN) {
                this._aspectBoolean(data);
                return;
            }
            else if (next === GrammarNode.ASPECT_NUMBER) {
                this._aspectNumber(data);
                return;
            }
            else if (next === GrammarNode.ASPECT_BOOLEAN_LIST) {
                this._aspectBooleanList(data);
                return;
            }
        }

        throw new Error('Invalid Grammar: _if ' + data.index);
    }

    private _aspectBoolean(data: FunctionData) {
        console.log('_aspectBoolean')
        console.log(JSON.parse(JSON.stringify(data)))

        let currentAspect = this.mapValues[data.index];
        data.pendingConditionalValue = this.characterMakerService.valueOfAspect(currentAspect);

        let next = this.stack[++data.index];
        if (next === GrammarNode.EQUAL_OR_NOT) {
            this._equalOrNot(data);
            return;
        }

        throw new Error('Invalid Grammar: _aspectBoolean ' + data.index);
    }

    private _aspectBooleanList(data: FunctionData) {
        console.log('_aspectBooleanList')
        console.log(JSON.parse(JSON.stringify(data)))

        let currentAspect = this.mapValues[data.index];
        let checkboxes = this.characterMakerService.valueOfAspect(currentAspect);

        let next = this.stack[++data.index];
        if (next === GrammarNode.ASPECT_BOOLEAN_LIST_ITEM) {
            let currentItem = this.mapValues[data.index];
            console.log(JSON.parse(JSON.stringify(this.mapValues)))
            console.log('checkboxes')
            console.log(checkboxes)
            console.log('currentItem')
            console.log(currentItem)
            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].label === currentItem.label) {
                    data.pendingConditionalValue = currentItem.value;
                }
            }
            next = this.stack[++data.index];
            if (next === GrammarNode.EQUAL_OR_NOT) {
                this._equalOrNot(data);
                return;
            }
        }

        throw new Error('Invalid Grammar: _aspectBooleanList ' + data.index);
    }

    private _aspectNumber(data: FunctionData) {
        console.log('_aspectNumber')
        console.log(JSON.parse(JSON.stringify(data)))

        let currentAspect = this.mapValues[data.index];
        data.pendingConditionalValue = this.characterMakerService.valueOfAspect(currentAspect);

        let next = this.stack[++data.index];
        if (next === GrammarNode.LOGIC_OPERATOR) {
            this._logicOperator(data);
            return;
        }

        throw new Error('Invalid Grammar: _aspectNumber ' + data.index);
    }

    private _equalOrNot(data: FunctionData) {
        console.log('_equalOrNot');
        console.log(JSON.parse(JSON.stringify(data)))

        data.pendingLogicOperator = this.mapValues[data.index];

        let next = this.stack[++data.index];
        if (next === GrammarNode.BOOLEAN) {
            this._boolean(data);
            return;
        }
        else if (next === GrammarNode.ASPECT_BOOLEAN_THEN) {
            this._aspectBooleanThen(data);
            return;
        }

        throw new Error('Invalid Grammar: _equalOrNot ' + data.index);
    }

    private _logicOperator(data: FunctionData) {
        console.log('_logicOperator')
        console.log(JSON.parse(JSON.stringify(data)))

        data.pendingLogicOperator = this.mapValues[data.index];

        let next = this.stack[++data.index];
        if (next === GrammarNode.ASPECT_NUMBER_THEN) {
            this._aspectNumberThen(data);
            return;
        }
        else if (next === GrammarNode.NUMBER) {
            this._number(data);
            return;
        }

        throw new Error('Invalid Grammar: _logicOperator ' + data.index);
    }

    private _boolean(data: FunctionData) {
        console.log('_boolean')
        console.log(JSON.parse(JSON.stringify(data)))

        data.operationalConditionalValue = this.mapValues[data.index];
        let next = this.stack[++data.index];
        if (next === GrammarNode.THEN) {
            this._then(data);
            return;
        }

        throw new Error('Invalid Grammar: _boolean ' + data.index);
    }

    private _aspectBooleanThen(data: FunctionData) {
        console.log('_aspectBooleanThen')
        console.log(JSON.parse(JSON.stringify(data)))

        let currentNode = this.mapValues[data.index];
        data.operationalConditionalValue = this.characterMakerService.valueOfAspect(currentNode);
        let next = this.stack[++data.index];
        if (next === GrammarNode.THEN) {
            this._then(data);
            return;
        }

        throw new Error('Invalid Grammar: _aspectBooleanThen ' + data.index);
    }

    private _aspectNumberThen(data: FunctionData) {
        console.log('_aspectNumberThen')
        console.log(JSON.parse(JSON.stringify(data)))

        let currentNode = this.mapValues[data.index];
        let aspectValue = this.characterMakerService.valueOfAspect(currentNode);
        if (data.pendingOperator === '+') {
            data.operationalConditionalValue += aspectValue;
        }
        else if (data.pendingOperator === '-') {
            data.operationalConditionalValue -= aspectValue;
        }
        else if (data.pendingOperator === '*') {
            data.operationalConditionalValue *= aspectValue;
        }
        else if (data.pendingOperator === '/') {
            data.operationalConditionalValue /= aspectValue;
        }
        else {
            data.operationalConditionalValue = aspectValue;
        }
        data.operationalConditionalValue = Math.floor(data.operationalConditionalValue);
        data.pendingOperator = null;

        let next = this.stack[++data.index];
        if (next === GrammarNode.OPERATOR) {
            this._operator(data);
            return;
        }
        else if (next === GrammarNode.THEN) {

            this._then(data);
            return;
        }

        throw new Error('Invalid Grammar: _aspectNumberThen ' + data.index);
    }

    private _number(data: FunctionData) {
        console.log('_number')
        console.log(JSON.parse(JSON.stringify(data)))

        let currentValue = this.mapValues[data.index];
        if (data.pendingOperator === '+') {
            data.operationalConditionalValue += currentValue;
        }
        else if (data.pendingOperator === '-') {
            data.operationalConditionalValue -= currentValue;
        }
        else if (data.pendingOperator === '*') {
            data.operationalConditionalValue *= currentValue;
        }
        else if (data.pendingOperator === '/') {
            data.operationalConditionalValue /= currentValue;
        }
        else {
            data.operationalConditionalValue = currentValue;
        }
        data.operationalConditionalValue = Math.floor(data.operationalConditionalValue);
        data.pendingOperator = null;

        let next = this.stack[++data.index];
        if (next === GrammarNode.OPERATOR) {
            this._operator(data);
            return;
        }
        else if (next === GrammarNode.THEN) {
            this._then(data);
            return;
        }

        throw new Error('Invalid Grammar: _number ' + data.index);
    }

    private _operator(data: FunctionData) {
        console.log('_operator')
        console.log(JSON.parse(JSON.stringify(data)))

        data.pendingLogicOperator = this.mapValues[data.index];

        let next = this.stack[++data.index];
        if (next === GrammarNode.ASPECT_NUMBER_THEN) {
            this._aspectNumberThen(data);
            return;
        }
        else if (next === GrammarNode.NUMBER) {
            this._number(data);
            return;
        }

        throw new Error('Invalid Grammar: _operator ' + data.index);
    }

    private _then(data: FunctionData) {
        console.log('_then')
        console.log(JSON.parse(JSON.stringify(data)))

        if (data.pendingLogicOperator === "==") {
            data.condition = data.condition && data.pendingConditionalValue == data.operationalConditionalValue;
        }
        else if (data.pendingLogicOperator === "!=") {
            data.condition = data.condition && data.pendingConditionalValue != data.operationalConditionalValue;
        }
        else if (data.pendingLogicOperator === "<") {
            data.condition = data.condition && data.pendingConditionalValue < data.operationalConditionalValue;
        }
        else if (data.pendingLogicOperator === ">") {
            data.condition = data.condition && data.pendingConditionalValue > data.operationalConditionalValue;
        }
        else if (data.pendingLogicOperator === "<=") {
            data.condition = data.condition && data.pendingConditionalValue <= data.operationalConditionalValue;
        }
        else if (data.pendingLogicOperator === ">=") {
            data.condition = data.condition && data.pendingConditionalValue >= data.operationalConditionalValue;
        }
        data.pendingLogicOperator = null;

        let next = this.stack[++data.index];
        if (next === GrammarNode.IF) {
            this._if(data);
            return;
        }
        else if (next === GrammarNode.THIS) {
            this._this(data);
            return;
        }

        throw new Error('Invalid Grammar: _then ' + data.index);
    }

    private _this(data: FunctionData) {
        console.log('_this')
        console.log(JSON.parse(JSON.stringify(data)))

        let next = this.stack[++data.index];
        if (next === GrammarNode.ASSIGNED) {
            this._assigned(data);
            return;
        }

        throw new Error('Invalid Grammar: _this ' + data.index);
    }

    private _assigned(data: FunctionData) {
        console.log('_assigned');
        console.log(JSON.parse(JSON.stringify(data)))

        // if the _if logic is false
        if (!data.condition) {
            // see if there is an if_not, otherwise return null
            data.value = null;
            while (data.index < this.stack.length) {
                let next = this.stack[++data.index];
                if (next === GrammarNode.IF_NOT) {
                    data.pendingOperator= null;
                    data.pendingLogicOperator = null;
                    data.condition = true;
                    data.pendingConditionalValue = null;
                    data.operationalConditionalValue = null;
                    data.value = 0;
                    next = this.stack[++data.index];
                    if (next === GrammarNode.IF) {
                        this._if(data);
                        return;
                    }
                    else if (next === GrammarNode.THIS) {
                        this._this(data);
                        return;
                    }

                    throw new Error('Invalid Grammar: _assigned ' + data.index);
                }
            }

            return;
        }

        let next = this.stack[++data.index];
        if (next === GrammarNode.ASSIGNED_NUMBER) {
            this._assignedNumber(data);
            return;
        }
        else if (next === GrammarNode.ASPECT) {
            next = this.stack[++data.index];
            if (next === GrammarNode.ASSIGNED_ASPECT_NUMBER_FIRST) {
                data.value = 0;
                this._assignedAspectNumber(data);
                return;
            }
            else if (next === GrammarNode.ASSIGNED_ASPECT_BOOLEAN) {
                this._assignedAspectBoolean(data);
                return;
            }
        }
        else if (next === GrammarNode.ASSIGNED_BOOLEAN) {
            this._assignedBoolean(data);
            return;
        }

        throw new Error('Invalid Grammar: _assigned ' + data.index);
    }

    private _assignedAspectNumber(data: FunctionData) {
        console.log('_assignedAspectNumber')
        console.log(JSON.parse(JSON.stringify(data)))

        let currentAspect = this.mapValues[data.index];
        let aspectValue = this.characterMakerService.valueOfAspect(currentAspect);
        if (!data.pendingOperator) {
            data.value = aspectValue;
        }
        else if (data.pendingOperator === '+') {
            data.value += aspectValue;
        }
        else if (data.pendingOperator === '-') {
            data.value -= aspectValue;
        }
        else if (data.pendingOperator === '*') {
            data.value *= aspectValue;
        }
        else if (data.pendingOperator === '/') {
            data.value /= aspectValue;
        }
        data.pendingOperator = null;
        data.value = Math.floor(data.value);

        let next = this.stack[++data.index];
        if (next === GrammarNode.ASSIGNED_OPERATOR) {
            this._assignedOperator(data);
            return;
        }
        else if (next === GrammarNode.IF_NOT) {
            this._if_not(data);
            return;
        }
        else if (next === GrammarNode.DONE) {
            this._done(data);
            return;
        }

        throw new Error('Invalid Grammar: _assignedAspectNumberFirst ' + data.index);
    }

    private _assignedAspectBoolean(data: FunctionData) {
        console.log('_assignedAspectBoolean')
        console.log(JSON.parse(JSON.stringify(data)))

        let currentAspect = this.mapValues[data.index];
        data.value = this.characterMakerService.valueOfAspect(currentAspect);

        let next = this.stack[++data.index];
        if (next === GrammarNode.IF_NOT) {
            this._if_not(data);
            return;
        }
        else if (next === GrammarNode.DONE) {
            this._done(data);
            return;
        }

        throw new Error('Invalid Grammar: _assignedAspectBoolean ' + data.index);
    }

    private _assignedNumber(data: FunctionData) {
        console.log('_assignedNumber')
        console.log(JSON.parse(JSON.stringify(data)))

        let currentValue: number = +this.mapValues[data.index];
        if (!data.pendingOperator) {
            data.value = currentValue;
        }
        else if (data.pendingOperator === '+') {
            data.value += currentValue;
        }
        else if (data.pendingOperator === '-') {
            data.value -= currentValue;
        }
        else if (data.pendingOperator === '*') {
            data.value *= currentValue;
        }
        else if (data.pendingOperator === '/') {
            data.value /= currentValue;
        }
        data.pendingOperator = null;
        data.value = Math.floor(data.value);

        let next = this.stack[++data.index];
        if (next === GrammarNode.ASSIGNED_OPERATOR) {
            this._assignedOperator(data);
            return;
        }
        else if (next === GrammarNode.IF_NOT) {
            this._if_not(data);
            return;
        }
        else if (next === GrammarNode.DONE) {
            this._done(data);
            return;
        }

        throw new Error('Invalid Grammar: _assignedNumber ' + data.index);
    }

    private _assignedBoolean(data: FunctionData) {
        console.log('_assignedBoolean')
        console.log(JSON.parse(JSON.stringify(data)))

        data.value = this.mapValues[data.index];
        let next = this.stack[++data.index];
        if (next === GrammarNode.IF_NOT) {
            this._if_not(data);
            return;
        }
        if (next === GrammarNode.DONE) {
            this._done(data);
            return;
        }

        throw new Error('Invalid Grammar: _assignedBoolean ' + data.index);
    }

    private _assignedOperator(data: FunctionData) {
        console.log('_assignedOperator')
        console.log(JSON.parse(JSON.stringify(data)))

        let currentNode = this.mapValues[data.index];
        console.log('selected assigned operator')
        console.log(currentNode)
        data.pendingOperator = currentNode;

        let next = this.stack[++data.index];
        if (next === GrammarNode.ASSIGNED_NUMBER) {
            this._assignedNumber(data);
            return;
        }
        else if (next === GrammarNode.ASSIGNED_ASPECT_NUMBER) {
            this._assignedAspectNumber(data);
            return;
        }

        throw new Error('Invalid Grammar: _assignedOperator ' + data.index);
    }

    private _if_not(data: FunctionData) {
        console.log('_if_not')
        console.log(JSON.parse(JSON.stringify(data)))
        this._done(data);
    }

    private _done(data: FunctionData) {
        console.log(JSON.parse(JSON.stringify(data)))
        console.log("---!!! DONE !!!---");
    }
}
