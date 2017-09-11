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
    ASSIGNED_BOOLEAN = 'ASSIGNED_BOOLEAN',
    ASSIGNED_ASPECT_BOOLEAN = 'ASSIGNED_ASPECT_BOOLEAN',
    ASSIGNED_OPERATOR = 'ASSIGNED_OPERATOR',
    DONE = 'DONE'
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
    private currentIndex: number;

    constructor() {
        this.stack = [];
        this.currentIndex = -1;
    }

    public push(nextNode: GrammarNode): void {
        this.stack.push(nextNode);
        this.currentIndex++;
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
}
