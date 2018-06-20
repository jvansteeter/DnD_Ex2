import {CellTarget} from './cell-target';

export class EdgeMoveAction {
    sourcePoint: CellTarget;
    targetPoint: CellTarget;
    quadOne: CellTarget;
    quadTwo: CellTarget;

    constructor(source: CellTarget, target: CellTarget, quadOne: CellTarget, quadTwo: CellTarget){
        this.sourcePoint = source;
        this.targetPoint = target;
        this.quadOne = quadOne;
        this.quadTwo = quadTwo;
    }
}