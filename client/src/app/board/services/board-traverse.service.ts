import {Injectable} from '@angular/core';
import {CellTarget} from '../shared/cell-target';
import {XyPair} from '../geometry/xy-pair';
import {CellRegion} from '../shared/enum/cell-region';

@Injectable()
export class BoardTraverseService {
    public blockingSegments: Set<string>;

    constructor() {
        this.blockingSegments = new Set();
    }

    public blockNorth(cell: XyPair) {
        this.blockingSegments.add(new CellTarget(cell, CellRegion.TOP_EDGE).hash());
    }
    public unblockNorth(cell: XyPair) {
        this.blockingSegments.delete(new CellTarget(cell, CellRegion.TOP_EDGE).hash());
    }

    public blockWest(cell: XyPair) {
        this.blockingSegments.add(new CellTarget(cell, CellRegion.LEFT_EDGE).hash());
    }
    public unblockWest(cell: XyPair) {
        this.blockingSegments.delete(new CellTarget(cell, CellRegion.LEFT_EDGE).hash());
    }

    public blockFwd(cell: XyPair) {
        this.blockingSegments.add(new CellTarget(cell, CellRegion.FWRD_EDGE).hash());
    }
    public unblockFwd(cell: XyPair) {
        this.blockingSegments.delete(new CellTarget(cell, CellRegion.FWRD_EDGE).hash());
    }

    public blockBkw(cell: XyPair) {
        this.blockingSegments.add(new CellTarget(cell, CellRegion.BKWD_EDGE).hash());
    }
    public unblockBkw(cell: XyPair) {
        this.blockingSegments.delete(new CellTarget(cell, CellRegion.BKWD_EDGE).hash());
    }

    public calcTraversableCells(sourceCell: XyPair, range: number): Array<XyPair> {
        const returnMe = Array<XyPair>();

        const queue: { cell: XyPair, range: number, diagAsDouble: boolean }[] = [];
        const touched: Array<string> = [];

        queue.push({cell: sourceCell, range: range, diagAsDouble: false});
        touched.push(sourceCell.hash());

        while (queue.length > 0) {
            const curCell = queue.shift();

            if (curCell.range >= 0) {
                if (this.canMoveN(curCell.cell)) {
                    const northCell = new XyPair(curCell.cell.x, curCell.cell.y - 1);
                    if (touched.indexOf(northCell.hash()) === -1) {
                        queue.push({cell: northCell, range: curCell.range - 1, diagAsDouble: curCell.diagAsDouble});
                        touched.push(northCell.hash());
                    }
                }

                if (this.canMoveE(curCell.cell)) {
                    const eastCell = new XyPair(curCell.cell.x + 1, curCell.cell.y);
                    if (touched.indexOf(eastCell.hash()) === -1) {
                        queue.push({cell: eastCell, range: curCell.range - 1, diagAsDouble: curCell.diagAsDouble});
                        touched.push(eastCell.hash());
                    }
                }

                if (this.canMoveS(curCell.cell)) {
                    const southCell = new XyPair(curCell.cell.x, curCell.cell.y + 1);
                    if (touched.indexOf(southCell.hash()) === -1) {
                        queue.push({cell: southCell, range: curCell.range - 1, diagAsDouble: curCell.diagAsDouble});
                        touched.push(southCell.hash());
                    }
                }

                if (this.canMoveW(curCell.cell)) {
                    const westCell = new XyPair(curCell.cell.x - 1, curCell.cell.y);
                    if (touched.indexOf(westCell.hash()) === -1) {
                        queue.push({cell: westCell, range: curCell.range - 1, diagAsDouble: curCell.diagAsDouble});
                        touched.push(westCell.hash());
                    }
                }

                if (this.canMoveNE(curCell.cell)) {
                    const northEastCell = new XyPair(curCell.cell.x + 1, curCell.cell.y - 1);
                    if (touched.indexOf(northEastCell.hash()) === -1) {
                        let rangeDelta;
                        if (curCell.diagAsDouble) {
                            rangeDelta = -2;
                        } else {
                            rangeDelta = -1;
                        }
                        queue.push({cell: northEastCell, range: curCell.range + rangeDelta, diagAsDouble: !curCell.diagAsDouble});
                        touched.push(northEastCell.hash());
                    }
                }

                if (this.canMoveNW(curCell.cell)) {
                    const northWestCell = new XyPair(curCell.cell.x - 1, curCell.cell.y - 1);
                    if (touched.indexOf(northWestCell.hash()) === -1) {
                        let rangeDelta;
                        if (curCell.diagAsDouble) {
                            rangeDelta = -2;
                        } else {
                            rangeDelta = -1;
                        }
                        queue.push({cell: northWestCell, range: curCell.range + rangeDelta, diagAsDouble: !curCell.diagAsDouble});
                        touched.push(northWestCell.hash());
                    }
                }

                if (this.canMoveSE(curCell.cell)) {
                    const southEastCell = new XyPair(curCell.cell.x + 1, curCell.cell.y + 1);
                    if (touched.indexOf(southEastCell.hash()) === -1) {
                        let rangeDelta;
                        if (curCell.diagAsDouble) {
                            rangeDelta = -2;
                        } else {
                            rangeDelta = -1;
                        }
                        queue.push({cell: southEastCell, range: curCell.range + rangeDelta, diagAsDouble: !curCell.diagAsDouble});
                        touched.push(southEastCell.hash());
                    }
                }

                if (this.canMoveSW(curCell.cell)) {
                    const southWestCell = new XyPair(curCell.cell.x - 1, curCell.cell.y + 1);
                    if (touched.indexOf(southWestCell.hash()) === -1) {
                        let rangeDelta;
                        if (curCell.diagAsDouble) {
                            rangeDelta = -2;
                        } else {
                            rangeDelta = -1;
                        }
                        queue.push({cell: southWestCell, range: curCell.range + rangeDelta, diagAsDouble: !curCell.diagAsDouble});
                        touched.push(southWestCell.hash());
                    }
                }
                returnMe.push(curCell.cell);
            }
        }
        return returnMe;
    }

    private targetIsBlocked(target: CellTarget): boolean {
        return this.blockingSegments.has(target.hash());
    }


    public canMoveN(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.TOP_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y - 1), CellRegion.FWRD_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y - 1), CellRegion.BKWD_EDGE))) {
            return false;
        }
        return true;
    }

    public canMoveNE(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y - 1), CellRegion.FWRD_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y - 1), CellRegion.BKWD_EDGE)) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y - 1), CellRegion.LEFT_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.TOP_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y - 1), CellRegion.LEFT_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.LEFT_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.TOP_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.TOP_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.TOP_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.LEFT_EDGE)))) {
            return false;
        }
        return true;
    }

    public canMoveE(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.LEFT_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.FWRD_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.BKWD_EDGE))) {
            return false;
        }
        return true;
    }

    public canMoveSE(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellRegion.FWRD_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellRegion.BKWD_EDGE)) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.LEFT_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.TOP_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.LEFT_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellRegion.LEFT_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.TOP_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellRegion.TOP_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellRegion.TOP_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellRegion.LEFT_EDGE)))) {
            return false;
        }
        return true;
    }

    public canMoveS(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.TOP_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.FWRD_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.BKWD_EDGE))) {
            return false;
        }
        return true;
    }

    public canMoveSW(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y + 1), CellRegion.FWRD_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y + 1), CellRegion.BKWD_EDGE)) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y + 1), CellRegion.TOP_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.LEFT_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.LEFT_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.TOP_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.LEFT_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.LEFT_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y + 1), CellRegion.TOP_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.TOP_EDGE)))) {
            return false;
        }
        return true;
    }

    public canMoveW(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.LEFT_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y), CellRegion.FWRD_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y), CellRegion.BKWD_EDGE))) {
            return false;
        }
        return true;
    }

    public canMoveNW(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y - 1), CellRegion.FWRD_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y - 1), CellRegion.BKWD_EDGE)) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.TOP_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y), CellRegion.TOP_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.LEFT_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y - 1), CellRegion.LEFT_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.LEFT_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.TOP_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y), CellRegion.TOP_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y - 1), CellRegion.LEFT_EDGE)))) {
            return false;
        }
        return true;
    }
}
