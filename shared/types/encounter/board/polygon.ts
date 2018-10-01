import {XyPair} from "./xy-pair";

export class Polygon {
    public border: Array<XyPair>;

    constructor() {
        this.border = new Array<XyPair>();
    }
}