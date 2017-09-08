export enum GrammarNode {
    START = 'START',
    IF = 'IF',
    THEN = 'THEN',
    THIS = 'THIS',
    ASPECT = 'ASPECT',
    ASPECT_BOOLEAN = 'ASPECT_BOOLEAN',
    ASPECT_NUMBER = 'ASPECT_NUMBER',
    OPERATOR = 'OPERATOR',
    LOGIC_OPERATOR = 'LOGIC_OPERATOR',
    EQUAL_OR_NOT = 'EQUAL_OR_NOT',
    ASSIGNED = 'ASSIGNED',
    NUMBER = 'NUMBER',
    BOOLEAN = 'BOOLEAN'
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
            GrammarNode.OPERATOR,
            GrammarNode.LOGIC_OPERATOR
        ],
        'ASPECT_BOOLEAN': [
              GrammarNode.EQUAL_OR_NOT
        ],
        'OPERATOR': [
            GrammarNode.ASPECT,
            GrammarNode.NUMBER
        ],
        'LOGIC_OPERATOR': [
            GrammarNode.NUMBER,
            GrammarNode.ASPECT,
            GrammarNode.BOOLEAN
        ],
        'EQUAL_OR_NOT': [
            GrammarNode.BOOLEAN,
            GrammarNode.ASPECT_BOOLEAN,
        ],
        'ASSIGNED': [
            GrammarNode.ASPECT,
            GrammarNode.NUMBER,
            GrammarNode.BOOLEAN
        ],
        'NUMBER': [
            GrammarNode.OPERATOR,
            GrammarNode.LOGIC_OPERATOR,
            GrammarNode.THEN
        ],
        'BOOLEAN': [
            GrammarNode.OPERATOR,
            GrammarNode.LOGIC_OPERATOR,
            GrammarNode.THEN
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
