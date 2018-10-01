export class XyPair {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString(): string {
        return 'XY_PAIR: ' + this.x + ',' + this.y;
    }

    hash(): string {
        return this.toString();
    }
}
