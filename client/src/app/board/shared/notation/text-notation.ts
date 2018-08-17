import {XyPair} from "../../geometry/xy-pair";

export class TextNotation {
    public id: string;
    public anchor: XyPair;
    public text: string;
    public fontSize: number;

    constructor() {
        this.id = window.crypto.getRandomValues(new Uint32Array(1))[0];
    }
}