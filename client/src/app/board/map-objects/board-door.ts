import {CellTarget} from '../shared/cell-target';

export class BoardDoor {
    public isOpen = false;
    public target: CellTarget;

    constructor(target: CellTarget, isOpen = false) {
        this.target = target;
        this.isOpen = isOpen;
    }
}