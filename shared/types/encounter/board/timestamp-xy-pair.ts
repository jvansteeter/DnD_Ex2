import {XyPair} from "./xy-pair";

export class TimestampXyPair extends XyPair {
    timestamp: number;

    constructor(x: number, y: number) {
        super(x, y);
        this.timestamp = Date.now();
    }

    toString(): string {
        return 'TIMESTAMP_XY_PAIR: ' + this.x + ',' + this.y + ' - timestamp (mils): ' + this.timestamp;
    }
}