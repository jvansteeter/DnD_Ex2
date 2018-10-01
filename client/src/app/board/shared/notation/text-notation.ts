import {XyPair} from "../../../../../../shared/types/encounter/board/geometry/xy-pair";
import { TextNotationData } from '../../../../../../shared/types/encounter/board/text-notation.data';

export class TextNotation implements TextNotationData {
    public _id: string;
    public anchor: XyPair;
    public text: string;
    public fontSize: number;

    constructor() {
        this._id = window.crypto.getRandomValues(new Uint32Array(1))[0];
    }
}