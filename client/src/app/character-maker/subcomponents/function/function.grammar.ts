import { CharacterMakerService } from '../../character-maker.service';

export enum GrammarNode {
    START = 'START',
    IF = 'IF',
    THEN = 'THEN',
    THIS = 'THIS',
    ASPECT = 'ASPECT',
    ASPECT_BOOLEAN = 'ASPECT_BOOLEAN',
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
    DONE = 'DONE'
}

interface FunctionNode {
    index: number,
    pendingOperator: any,
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
            GrammarNode.DONE
        ],
        'ASSIGNED_ASPECT_NUMBER': [
            GrammarNode.ASSIGNED_OPERATOR,
            GrammarNode.DONE
        ],
        'ASSIGNED_ASPECT_NUMBER_FIRST': [
            GrammarNode.ASSIGNED_OPERATOR,
            GrammarNode.DONE
        ],
        'ASSIGNED_BOOLEAN': [
            GrammarNode.DONE
        ],
        'ASSIGNED_ASPECT_BOOLEAN': [
            GrammarNode.DONE
        ],
        'ASSIGNED_OPERATOR': [
            GrammarNode.ASSIGNED_NUMBER,
            GrammarNode.ASSIGNED_ASPECT_NUMBER
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

    public value(): any{
        try {
            this._start();
        }
        catch (error) {
            console.error(error);
            return 'NaN';
        }

        return {};
    }

    private _start(): void {
        console.log('_start')
        if (this.stack[0] !== GrammarNode.START) {
            throw new Error('Invalid Grammar');
        }
        let next = this.stack[1];
        if (next === GrammarNode.IF) {
            this._if({index: 1, pendingOperator: null, value: ''});
            return;
        }
        else if (next === GrammarNode.THIS) {
            this._this({index: 1, pendingOperator: null, value: ''});
            return;
        }

        throw new Error('Invalid Grammar');
    }

    private _if(data: FunctionNode) {
        if (this.stack[++data.index] !== GrammarNode.ASPECT) {
            throw new Error('Invalid Grammar: _if ' + data.index);
        }
        let next = this.stack[++data.index];
        if (next === GrammarNode.ASPECT_BOOLEAN) {
            this._equalOrNot(data.index);
        }
    }

    private _equalOrNot(index: number) {

    }

    private _this(data: FunctionNode) {
        console.log('_this')
        let next = this.stack[++data.index];
        if (next === GrammarNode.ASSIGNED) {
            this._assigned(data);
            return;
        }

        throw new Error('Invalid Grammar: _this ' + data.index);
    }

    private _assigned(data: FunctionNode) {
        console.log('_assigned');
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
        }
        else if (next === GrammarNode.ASSIGNED_BOOLEAN) {
            this._assignedBoolean(data);
            return;
        }

        throw new Error('Invalid Grammar: _assigned ' + data.index);
    }

    private _assignedAspectNumber(data: FunctionNode) {
        console.log('_assignedAspectNumber')

        if (!data.pendingOperator) {
            data.value = this.mapValues[data.index];
            console.log(this.mapValues[data.index]);
            console.log('Attempting to get value of aspect')
            console.log(this.characterMakerService.valueOf(data.value));
        }

        let next = this.stack[++data.index];
        if (next === GrammarNode.ASSIGNED_OPERATOR) {
            this._assignedOperator(data);
            return;
        }
        else if (next === GrammarNode.DONE) {
            this._done();
            return;
        }

        throw new Error('Invalid Grammar: _assignedAspectNumberFirst ' + data.index);
    }

    private _assignedNumber(data: FunctionNode) {
        console.log('_assignedNumber')
        let next = this.stack[++data.index];
        if (next === GrammarNode.ASSIGNED_OPERATOR) {
            this._assignedOperator(data);
            return;
        }
        else if (next === GrammarNode.DONE) {
            this._done();
            return;
        }

        throw new Error('Invalid Grammar: _assignedNumber ' + data.index);
    }

    private _assignedBoolean(data: FunctionNode) {
        console.log('_assignedBoolean')
        let next = this.stack[++data.index];
        if (next === GrammarNode.DONE) {
            this._done();
            return;
        }

        throw new Error('Invalid Grammar: _assignedBoolean ' + data.index);
    }

    private _assignedOperator(data: FunctionNode) {
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

    private _done() {
        console.log("---!!! DONE !!!---");
    }
}
