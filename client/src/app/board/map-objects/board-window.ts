import {CellTarget} from "../shared/cell-target";

export class BoardWindow {
    public isTransparent = true;
    public isBlocking = true;
    public target: CellTarget;

    constructor(target: CellTarget, isTransparent = true, isBlocking = true) {
        this.isBlocking = isBlocking;
        this.isTransparent = isTransparent;
        this.target = target;
    }
}