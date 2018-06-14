import {Injectable} from '@angular/core';
import {CellTarget} from '../shared/cell-target';
import {XyPair} from '../geometry/xy-pair';
import {CellZone} from '../shared/cell-zone';

@Injectable()
export class BoardTraverseService {
    public blockingSegments: Set<string>;

    constructor() {
        this.blockingSegments = new Set();
    }

    public blockNorth(cell: XyPair) {
        this.blockingSegments.add(new CellTarget(cell, CellZone.NORTH).hash());
    }
    public unblockNorth(cell: XyPair) {
        this.blockingSegments.delete(new CellTarget(cell, CellZone.NORTH).hash());
    }

    public blockWest(cell: XyPair) {
        this.blockingSegments.add(new CellTarget(cell, CellZone.WEST).hash());
    }
    public unblockWest(cell: XyPair) {
        this.blockingSegments.delete(new CellTarget(cell, CellZone.WEST).hash());
    }

    public blockFwd(cell: XyPair) {
        this.blockingSegments.add(new CellTarget(cell, CellZone.FWR).hash());
    }
    public unblockFwd(cell: XyPair) {
        this.blockingSegments.delete(new CellTarget(cell, CellZone.FWR).hash());
    }

    public blockBkw(cell: XyPair) {
        this.blockingSegments.add(new CellTarget(cell, CellZone.BKW).hash());
    }
    public unblockBkw(cell: XyPair) {
        this.blockingSegments.delete(new CellTarget(cell, CellZone.BKW).hash());
    }

    public calcTraversableCells(sourceCell: XyPair, range: number): Array<XyPair> {
        const returnMe = Array<XyPair>();

        const queue: { cell: XyPair, range: number, diagAsDouble: boolean }[] = [];
        const touched: Array<string> = [];

        queue.push({cell: sourceCell, range: range, diagAsDouble: false});
        touched.push(sourceCell.hash2());

        while (queue.length > 0) {
            const curCell = queue.shift();

            if (curCell.range >= 0) {
                if (this.canMoveN(curCell.cell)) {
                    const northCell = new XyPair(curCell.cell.x, curCell.cell.y - 1);
                    if (touched.indexOf(northCell.hash2()) === -1) {
                        queue.push({cell: northCell, range: curCell.range - 1, diagAsDouble: curCell.diagAsDouble});
                        touched.push(northCell.hash2());
                    }
                }

                if (this.canMoveE(curCell.cell)) {
                    const eastCell = new XyPair(curCell.cell.x + 1, curCell.cell.y);
                    if (touched.indexOf(eastCell.hash2()) === -1) {
                        queue.push({cell: eastCell, range: curCell.range - 1, diagAsDouble: curCell.diagAsDouble});
                        touched.push(eastCell.hash2());
                    }
                }

                if (this.canMoveS(curCell.cell)) {
                    const southCell = new XyPair(curCell.cell.x, curCell.cell.y + 1);
                    if (touched.indexOf(southCell.hash2()) === -1) {
                        queue.push({cell: southCell, range: curCell.range - 1, diagAsDouble: curCell.diagAsDouble});
                        touched.push(southCell.hash2());
                    }
                }

                if (this.canMoveW(curCell.cell)) {
                    const westCell = new XyPair(curCell.cell.x - 1, curCell.cell.y);
                    if (touched.indexOf(westCell.hash2()) === -1) {
                        queue.push({cell: westCell, range: curCell.range - 1, diagAsDouble: curCell.diagAsDouble});
                        touched.push(westCell.hash2());
                    }
                }

                if (this.canMoveNE(curCell.cell)) {
                    const northEastCell = new XyPair(curCell.cell.x + 1, curCell.cell.y - 1);
                    if (touched.indexOf(northEastCell.hash2()) === -1) {
                        let rangeDelta;
                        if (curCell.diagAsDouble) {
                            rangeDelta = -2;
                        } else {
                            rangeDelta = -1;
                        }
                        queue.push({cell: northEastCell, range: curCell.range + rangeDelta, diagAsDouble: !curCell.diagAsDouble});
                        touched.push(northEastCell.hash2());
                    }
                }

                if (this.canMoveNW(curCell.cell)) {
                    const northWestCell = new XyPair(curCell.cell.x - 1, curCell.cell.y - 1);
                    if (touched.indexOf(northWestCell.hash2()) === -1) {
                        let rangeDelta;
                        if (curCell.diagAsDouble) {
                            rangeDelta = -2;
                        } else {
                            rangeDelta = -1;
                        }
                        queue.push({cell: northWestCell, range: curCell.range + rangeDelta, diagAsDouble: !curCell.diagAsDouble});
                        touched.push(northWestCell.hash2());
                    }
                }

                if (this.canMoveSE(curCell.cell)) {
                    const southEastCell = new XyPair(curCell.cell.x + 1, curCell.cell.y + 1);
                    if (touched.indexOf(southEastCell.hash2()) === -1) {
                        let rangeDelta;
                        if (curCell.diagAsDouble) {
                            rangeDelta = -2;
                        } else {
                            rangeDelta = -1;
                        }
                        queue.push({cell: southEastCell, range: curCell.range + rangeDelta, diagAsDouble: !curCell.diagAsDouble});
                        touched.push(southEastCell.hash2());
                    }
                }

                if (this.canMoveSW(curCell.cell)) {
                    const southWestCell = new XyPair(curCell.cell.x - 1, curCell.cell.y + 1);
                    if (touched.indexOf(southWestCell.hash2()) === -1) {
                        let rangeDelta;
                        if (curCell.diagAsDouble) {
                            rangeDelta = -2;
                        } else {
                            rangeDelta = -1;
                        }
                        queue.push({cell: southWestCell, range: curCell.range + rangeDelta, diagAsDouble: !curCell.diagAsDouble});
                        touched.push(southWestCell.hash2());
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
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellZone.NORTH)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y - 1), CellZone.FWR)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y - 1), CellZone.BKW))) {
            return false;
        }
        return true;
    }

    public canMoveNE(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y - 1), CellZone.FWR)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y - 1), CellZone.BKW)) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y - 1), CellZone.WEST)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellZone.NORTH))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y - 1), CellZone.WEST)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellZone.WEST))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellZone.NORTH)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellZone.NORTH))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellZone.NORTH)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellZone.WEST)))) {
            return false;
        }
        return true;
    }

    public canMoveE(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellZone.WEST)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellZone.FWR)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellZone.BKW))) {
            return false;
        }
        return true;
    }

    public canMoveSE(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellZone.FWR)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellZone.BKW)) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellZone.WEST)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellZone.NORTH))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellZone.WEST)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellZone.WEST))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellZone.NORTH)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellZone.NORTH))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellZone.NORTH)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellZone.WEST)))) {
            return false;
        }
        return true;
    }

    public canMoveS(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellZone.NORTH)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellZone.FWR)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellZone.BKW))) {
            return false;
        }
        return true;
    }

    public canMoveSW(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y + 1), CellZone.FWR)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y + 1), CellZone.BKW)) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y + 1), CellZone.NORTH)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellZone.WEST))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellZone.WEST)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellZone.NORTH))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellZone.WEST)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellZone.WEST))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y + 1), CellZone.NORTH)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellZone.NORTH)))) {
            return false;
        }
        return true;
    }

    public canMoveW(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellZone.WEST)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y), CellZone.FWR)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y), CellZone.BKW))) {
            return false;
        }
        return true;
    }

    public canMoveNW(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y - 1), CellZone.FWR)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y - 1), CellZone.BKW)) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellZone.NORTH)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y), CellZone.NORTH))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellZone.WEST)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y - 1), CellZone.WEST))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellZone.WEST)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellZone.NORTH))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y), CellZone.NORTH)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y - 1), CellZone.WEST)))) {
            return false;
        }
        return true;
    }
}
