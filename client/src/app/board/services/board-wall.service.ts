import {Injectable} from '@angular/core';
import {Wall} from '../map-objects/wall';
import {XyPair} from '../geometry/xy-pair';
import {CellTarget} from '../shared/cell-target';
import {CellZone} from '../shared/cell-zone';
import {BoardStateService} from './board-state.service';
import {BoardLosService} from './board-los.service';

@Injectable()
export class BoardWallService {
    public wallData: Map<string, Wall> = new Map();

    constructor(
        private boardStateService: BoardStateService,
        private boardLosService: BoardLosService
    ) {}

    public addWall(loc: CellTarget) {
        if (!this.hasWall(loc)) {
            this.wallData.set(loc.hash(), new Wall(loc, this.boardStateService.cell_res));

            switch (loc.zone) {
                case CellZone.NORTH:
                    this.boardLosService.blockNorth(loc.coor);
                    break;
                case CellZone.WEST:
                    this.boardLosService.blockWest(loc.coor);
                    break;
                case CellZone.FWR:
                    this.boardLosService.blockFwd(loc.coor);
                    break;
                case CellZone.BKW:
                    this.boardLosService.blockBkw(loc.coor);
                    break;
            }
        }
    }

    public removeWall(loc: CellTarget): void {
        if (this.hasWall(loc)) {
            this.wallData.delete(loc.hash());

            switch (loc.zone) {
                case CellZone.NORTH:
                    this.boardLosService.unblockNorth(loc.coor);
                    break;
                case CellZone.WEST:
                    this.boardLosService.unblockWest(loc.coor);
                    break;
                case CellZone.FWR:
                    this.boardLosService.unblockFwd(loc.coor);
                    break;
                case CellZone.BKW:
                    this.boardLosService.unblockBkw(loc.coor);
                    break;
            }
        }
    }

    public toggleWall(loc: CellTarget): void {
        if (this.hasWall(loc)) {
            this.removeWall(loc);
        } else {
            this.addWall(loc);
        }
    }

    public fillWallsBetweenCorners(corner1: XyPair, corner2: XyPair): void {
        const delta_x = corner2.x - corner1.x;
        const delta_y = corner2.y - corner1.y;
        const currentCell = corner1;

        // handle up
        if ((delta_x === 0) && (delta_y < 0)) {
            while (currentCell.y !== corner2.y) {
                currentCell.y--;
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.WEST));
            }
        }
        // handle down
        if ((delta_x === 0) && (delta_y > 0)) {
            while (currentCell.y !== corner2.y) {
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.WEST));
                currentCell.y++;
            }
        }
        // handle left
        if ((delta_x < 0) && (delta_y === 0)) {
            while (currentCell.x !== corner2.x) {
                currentCell.x--;
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.NORTH));
            }
        }
        // handle right
        if ((delta_x > 0) && (delta_y === 0)) {
            while (currentCell.x !== corner2.x) {
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.NORTH));
                currentCell.x++;
            }
        }
        // handle up/right
        if ((delta_x > 0) && (delta_y < 0)) {
            while (currentCell.x !== corner2.x) {
                currentCell.y--;
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.FWR));
                currentCell.x++;
            }
        }
        // handle down/right
        if ((delta_x > 0) && (delta_y > 0)) {
            while (currentCell.x !== corner2.x) {
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.BKW));
                currentCell.y++;
                currentCell.x++;
            }
        }
        // handle down/left
        if ((delta_x < 0) && (delta_y > 0)) {
            while (currentCell.x !== corner2.x) {
                currentCell.x--;
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.FWR));
                currentCell.y++;
            }
        }
        // handle up/left
        if ((delta_x < 0) && (delta_y < 0)) {
            while (currentCell.x !== corner2.x) {
                currentCell.x--;
                currentCell.y--;
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.BKW));
            }
        }
    }

    public hasWall(loc: CellTarget): boolean {
        return this.wallData.has(loc.hash());
    }

    calcTraversableCells(sourceCell: XyPair, range: number): Array<XyPair> {
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


    public canMoveN(loc: XyPair): boolean {
        if (this.hasWall(new CellTarget(new XyPair(loc.x, loc.y), CellZone.NORTH)) ||
            this.hasWall(new CellTarget(new XyPair(loc.x, loc.y - 1), CellZone.FWR)) ||
            this.hasWall(new CellTarget(new XyPair(loc.x, loc.y - 1), CellZone.BKW))) {
            return false;
        }
        return true;
    }

    public canMoveNE(loc: XyPair): boolean {
        if (this.hasWall(new CellTarget(new XyPair(loc.x + 1, loc.y - 1), CellZone.FWR)) ||
            this.hasWall(new CellTarget(new XyPair(loc.x + 1, loc.y - 1), CellZone.BKW)) ||
            (this.hasWall(new CellTarget(new XyPair(loc.x + 1, loc.y - 1), CellZone.WEST)) && this.hasWall(new CellTarget(new XyPair(loc.x + 1, loc.y), CellZone.NORTH))) ||
            (this.hasWall(new CellTarget(new XyPair(loc.x + 1, loc.y - 1), CellZone.WEST)) && this.hasWall(new CellTarget(new XyPair(loc.x + 1, loc.y), CellZone.WEST))) ||
            (this.hasWall(new CellTarget(new XyPair(loc.x, loc.y), CellZone.NORTH)) && this.hasWall(new CellTarget(new XyPair(loc.x + 1, loc.y), CellZone.NORTH))) ||
            (this.hasWall(new CellTarget(new XyPair(loc.x, loc.y), CellZone.NORTH)) && this.hasWall(new CellTarget(new XyPair(loc.x + 1, loc.y), CellZone.WEST)))) {
            return false;
        }
        return true;
    }

    public canMoveE(loc: XyPair): boolean {
        if (this.hasWall(new CellTarget(new XyPair(loc.x + 1, loc.y), CellZone.WEST)) ||
            this.hasWall(new CellTarget(new XyPair(loc.x + 1, loc.y), CellZone.FWR)) ||
            this.hasWall(new CellTarget(new XyPair(loc.x + 1, loc.y), CellZone.BKW))) {
            return false;
        }
        return true;
    }

    public canMoveSE(loc: XyPair): boolean {
        if (this.hasWall(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellZone.FWR)) ||
            this.hasWall(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellZone.BKW)) ||
            (this.hasWall(new CellTarget(new XyPair(loc.x + 1, loc.y), CellZone.WEST)) && this.hasWall(new CellTarget(new XyPair(loc.x, loc.y + 1), CellZone.NORTH))) ||
            (this.hasWall(new CellTarget(new XyPair(loc.x + 1, loc.y), CellZone.WEST)) && this.hasWall(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellZone.WEST))) ||
            (this.hasWall(new CellTarget(new XyPair(loc.x, loc.y + 1), CellZone.NORTH)) && this.hasWall(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellZone.NORTH))) ||
            (this.hasWall(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellZone.NORTH)) && this.hasWall(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellZone.WEST)))) {
            return false;
        }
        return true;
    }

    public canMoveS(loc: XyPair): boolean {
        if (this.hasWall(new CellTarget(new XyPair(loc.x, loc.y + 1), CellZone.NORTH)) ||
            this.hasWall(new CellTarget(new XyPair(loc.x, loc.y + 1), CellZone.FWR)) ||
            this.hasWall(new CellTarget(new XyPair(loc.x, loc.y + 1), CellZone.BKW))) {
            return false;
        }
        return true;
    }

    public canMoveSW(loc: XyPair): boolean {
        if (this.hasWall(new CellTarget(new XyPair(loc.x - 1, loc.y + 1), CellZone.FWR)) ||
            this.hasWall(new CellTarget(new XyPair(loc.x - 1, loc.y + 1), CellZone.BKW)) ||
            (this.hasWall(new CellTarget(new XyPair(loc.x - 1, loc.y + 1), CellZone.NORTH)) && this.hasWall(new CellTarget(new XyPair(loc.x, loc.y + 1), CellZone.WEST))) ||
            (this.hasWall(new CellTarget(new XyPair(loc.x, loc.y), CellZone.WEST)) && this.hasWall(new CellTarget(new XyPair(loc.x, loc.y + 1), CellZone.NORTH))) ||
            (this.hasWall(new CellTarget(new XyPair(loc.x, loc.y), CellZone.WEST)) && this.hasWall(new CellTarget(new XyPair(loc.x, loc.y + 1), CellZone.WEST))) ||
            (this.hasWall(new CellTarget(new XyPair(loc.x - 1, loc.y + 1), CellZone.NORTH)) && this.hasWall(new CellTarget(new XyPair(loc.x, loc.y + 1), CellZone.NORTH)))) {
            return false;
        }
        return true;
    }

    public canMoveW(loc: XyPair): boolean {
        if (this.hasWall(new CellTarget(new XyPair(loc.x, loc.y), CellZone.WEST)) ||
            this.hasWall(new CellTarget(new XyPair(loc.x - 1, loc.y), CellZone.FWR)) ||
            this.hasWall(new CellTarget(new XyPair(loc.x - 1, loc.y), CellZone.BKW))) {
            return false;
        }
        return true;
    }

    public canMoveNW(loc: XyPair): boolean {
        if (this.hasWall(new CellTarget(new XyPair(loc.x - 1, loc.y - 1), CellZone.FWR)) ||
            this.hasWall(new CellTarget(new XyPair(loc.x - 1, loc.y - 1), CellZone.BKW)) ||
            (this.hasWall(new CellTarget(new XyPair(loc.x, loc.y), CellZone.NORTH)) && this.hasWall(new CellTarget(new XyPair(loc.x - 1, loc.y), CellZone.NORTH))) ||
            (this.hasWall(new CellTarget(new XyPair(loc.x, loc.y), CellZone.WEST)) && this.hasWall(new CellTarget(new XyPair(loc.x, loc.y - 1), CellZone.WEST))) ||
            (this.hasWall(new CellTarget(new XyPair(loc.x, loc.y), CellZone.WEST)) && this.hasWall(new CellTarget(new XyPair(loc.x, loc.y), CellZone.NORTH))) ||
            (this.hasWall(new CellTarget(new XyPair(loc.x - 1, loc.y), CellZone.NORTH)) && this.hasWall(new CellTarget(new XyPair(loc.x, loc.y - 1), CellZone.WEST)))) {
            return false;
        }
        return true;
    }
}
