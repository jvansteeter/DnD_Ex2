export enum GrammarNode {
    START = 'START',
    IF = 'IF',
    THEN = 'THEN',
    THIS = 'THIS',
    ASPECT = 'ASPECT',
    OPERATOR = 'OPERATOR',
    LOGIC_OPERATOR = 'LOGIC_OPERATOR',
    ASSIGNED = 'ASSIGNED',
    NUMBER = 'NUMBER',
    BOOLEAN = 'BOOLEAN'
}

export class FunctionGrammar {
    public grammar = {
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
        'OPERATOR': [
            GrammarNode.ASPECT,
            GrammarNode.NUMBER
        ],
        'LOGIC_OPERATOR': [
            GrammarNode.NUMBER,
            GrammarNode.ASPECT,
            GrammarNode.BOOLEAN
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

    constructor() {
    }
}
