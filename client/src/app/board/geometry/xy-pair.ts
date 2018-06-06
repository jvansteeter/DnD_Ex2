import {Md5} from 'ts-md5/dist/md5';

export class XyPair {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString(): string {
        return this.x + ',' + this.y;
    }

    hash(): string {
        const hashValue = Md5.hashStr(this.toString());
        if (typeof hashValue === 'string') {
            return hashValue;
        } else {
            return null;
        }
    }

    hash2(): string {
        return this.x + '.' + this.y;
    }
}
