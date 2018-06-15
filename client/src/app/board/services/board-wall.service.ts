import {Injectable} from '@angular/core';
import {Wall} from '../map-objects/wall';
import {XyPair} from '../geometry/xy-pair';
import {CellTarget} from '../shared/cell-target';
import {CellZone} from '../shared/cell-zone';
import {BoardStateService} from './board-state.service';
import {BoardVisibilityService} from './board-visibility.service';
import {BoardTraverseService} from './board-traverse.service';
import {BoardLightService} from './board-light.service';

@Injectable()
export class BoardWallService {
    public wallData: Map<string, Wall> = new Map();

    constructor(
        private boardStateService: BoardStateService,
        private boardVisibilityService: BoardVisibilityService,
        private boardTraverseService: BoardTraverseService,
        private boardLightService: BoardLightService
    ) {
    }

    public addWall(loc: CellTarget, singleInstance = true) {
        if (!this.hasWall(loc)) {
            this.wallData.set(loc.hash(), new Wall(loc, this.boardStateService.cell_res));
            switch (loc.zone) {
                case CellZone.NORTH:
                    this.boardVisibilityService.blockNorth(loc.coor);
                    this.boardTraverseService.blockNorth(loc.coor);
                    break;
                case CellZone.WEST:
                    this.boardVisibilityService.blockWest(loc.coor);
                    this.boardTraverseService.blockWest(loc.coor);

                    break;
                case CellZone.FWR:
                    this.boardVisibilityService.blockFwd(loc.coor);
                    this.boardTraverseService.blockFwd(loc.coor);

                    break;
                case CellZone.BKW:
                    this.boardVisibilityService.blockBkw(loc.coor);
                    this.boardTraverseService.blockBkw(loc.coor);

                    break;
            }
        }
        if (singleInstance) {
            this.boardLightService.updateLightValues();
        }
    }

    public removeWall(loc: CellTarget , singleInstance = true): void {
        if (this.hasWall(loc)) {
            this.wallData.delete(loc.hash());
            switch (loc.zone) {
                case CellZone.NORTH:
                    this.boardVisibilityService.unblockNorth(loc.coor);
                    this.boardTraverseService.unblockNorth(loc.coor);
                    break;
                case CellZone.WEST:
                    this.boardVisibilityService.unblockWest(loc.coor);
                    this.boardTraverseService.unblockWest(loc.coor);

                    break;
                case CellZone.FWR:
                    this.boardVisibilityService.unblockFwd(loc.coor);
                    this.boardTraverseService.unblockFwd(loc.coor);

                    break;
                case CellZone.BKW:
                    this.boardVisibilityService.unblockBkw(loc.coor);
                    this.boardTraverseService.unblockBkw(loc.coor);

                    break;
            }
        }
        if (singleInstance) {
            this.boardLightService.updateLightValues();
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
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.WEST), false);
            }
        }
        // handle down
        if ((delta_x === 0) && (delta_y > 0)) {
            while (currentCell.y !== corner2.y) {
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.WEST), false);
                currentCell.y++;
            }
        }
        // handle left
        if ((delta_x < 0) && (delta_y === 0)) {
            while (currentCell.x !== corner2.x) {
                currentCell.x--;
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.NORTH), false);
            }
        }
        // handle right
        if ((delta_x > 0) && (delta_y === 0)) {
            while (currentCell.x !== corner2.x) {
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.NORTH), false);
                currentCell.x++;
            }
        }
        // handle up/right
        if ((delta_x > 0) && (delta_y < 0)) {
            while (currentCell.x !== corner2.x) {
                currentCell.y--;
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.FWR), false);
                currentCell.x++;
            }
        }
        // handle down/right
        if ((delta_x > 0) && (delta_y > 0)) {
            while (currentCell.x !== corner2.x) {
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.BKW), false);
                currentCell.y++;
                currentCell.x++;
            }
        }
        // handle down/left
        if ((delta_x < 0) && (delta_y > 0)) {
            while (currentCell.x !== corner2.x) {
                currentCell.x--;
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.FWR), false);
                currentCell.y++;
            }
        }
        // handle up/left
        if ((delta_x < 0) && (delta_y < 0)) {
            while (currentCell.x !== corner2.x) {
                currentCell.x--;
                currentCell.y--;
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.BKW), false);
            }
        }
        this.boardLightService.updateLightValues();
    }

    public hasWall(loc: CellTarget): boolean {
        return this.wallData.has(loc.hash());
    }
}
