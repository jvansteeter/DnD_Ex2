import {XyPair} from "./geometry/xy-pair";

export class Polygon {
    public border: Array<XyPair>;

    constructor() {
        this.border = new Array<XyPair>();
    }
}