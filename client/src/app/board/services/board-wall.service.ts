import {Injectable} from '@angular/core';
import {XyPair} from '../geometry/xy-pair';
import {CellTarget} from '../shared/cell-target';
import {CellRegion} from '../shared/enum/cell-region';
import {BoardStateService} from './board-state.service';
import {BoardVisibilityService} from './board-visibility.service';
import {BoardTraverseService} from './board-traverse.service';
import {BoardLightService} from './board-light.service';
import {BoardDoor} from '../map-objects/board-door';
import { EncounterService } from '../../encounter/encounter.service';
import {BoardPlayerService} from "./board-player.service";

@Injectable()
export class BoardWallService {
    public wallData: Map<string, CellTarget> = new Map<string, CellTarget>();
    public doorData: Map<string, BoardDoor> = new Map<string, BoardDoor>();
    public windowData: Map<string, CellTarget> = new Map<string, CellTarget>();

    constructor(
        private boardStateService: BoardStateService,
        private boardVisibilityService: BoardVisibilityService,
        private boardTraverseService: BoardTraverseService,
        private boardLightService: BoardLightService,
        private boardPlayerService: BoardPlayerService,
        private encounterService: EncounterService
    ) {
    }

    public addDoor(target: CellTarget) {
        if (!this.hasObstruction(target)) {
            this.doorData.set(target.hash(), new BoardDoor(target));
            switch (target.region) {
                case CellRegion.TOP_EDGE:
                    this.boardVisibilityService.blockNorth(target.location);
                    this.boardTraverseService.blockNorth(target.location);
                    break;
                case CellRegion.LEFT_EDGE:
                    this.boardVisibilityService.blockWest(target.location);
                    this.boardTraverseService.blockWest(target.location);
                    break;
                case CellRegion.FWRD_EDGE:
                    this.boardVisibilityService.blockFwd(target.location);
                    this.boardTraverseService.blockFwd(target.location);
                    break;
                case CellRegion.BKWD_EDGE:
                    this.boardVisibilityService.blockBkw(target.location);
                    this.boardTraverseService.blockBkw(target.location);
                    break;
            }
            this.boardLightService.updateLightValues();
            this.boardPlayerService.updateAllPlayerTraverse();
        }
    }

    public removeDoor(target: CellTarget) {
        if (this.hasObstruction(target) && this.doorData.has(target.hash())) {
            this.doorData.delete(target.hash());
            switch (target.region) {
                case CellRegion.TOP_EDGE:
                    this.boardVisibilityService.unblockNorth(target.location);
                    this.boardTraverseService.unblockNorth(target.location);
                    break;
                case CellRegion.LEFT_EDGE:
                    this.boardVisibilityService.unblockWest(target.location);
                    this.boardTraverseService.unblockWest(target.location);
                    break;
                case CellRegion.FWRD_EDGE:
                    this.boardVisibilityService.unblockFwd(target.location);
                    this.boardTraverseService.unblockFwd(target.location);
                    break;
                case CellRegion.BKWD_EDGE:
                    this.boardVisibilityService.unblockBkw(target.location);
                    this.boardTraverseService.unblockBkw(target.location);
                    break;
            }
        }
        this.boardLightService.updateLightValues();
        this.boardPlayerService.updateAllPlayerTraverse();
    }

    public toggleDoor(target: CellTarget) {
        if (this.hasObstruction(target) && this.doorData.has(target.hash())) {
            this.removeDoor(target);
        } else {
            this.addDoor(target);
        }
    }

    public openCloseDoor(target: CellTarget) {
        if (this.doorData.has(target.hash())) {
            if (this.doorData.get(target.hash()).isOpen) {
                this.doorData.get(target.hash()).isOpen = false;
                switch (target.region) {
                    case CellRegion.TOP_EDGE:
                        this.boardVisibilityService.blockNorth(target.location);
                        this.boardTraverseService.blockNorth(target.location);
                        break;
                    case CellRegion.LEFT_EDGE:
                        this.boardVisibilityService.blockWest(target.location);
                        this.boardTraverseService.blockWest(target.location);
                        break;
                    case CellRegion.FWRD_EDGE:
                        this.boardVisibilityService.blockFwd(target.location);
                        this.boardTraverseService.blockFwd(target.location);
                        break;
                    case CellRegion.BKWD_EDGE:
                        this.boardVisibilityService.blockBkw(target.location);
                        this.boardTraverseService.blockBkw(target.location);
                        break;
                }
            } else {
                this.doorData.get(target.hash()).isOpen = true;
                switch (target.region) {
                    case CellRegion.TOP_EDGE:
                        this.boardVisibilityService.unblockNorth(target.location);
                        this.boardTraverseService.unblockNorth(target.location);
                        break;
                    case CellRegion.LEFT_EDGE:
                        this.boardVisibilityService.unblockWest(target.location);
                        this.boardTraverseService.unblockWest(target.location);
                        break;
                    case CellRegion.FWRD_EDGE:
                        this.boardVisibilityService.unblockFwd(target.location);
                        this.boardTraverseService.unblockFwd(target.location);
                        break;
                    case CellRegion.BKWD_EDGE:
                        this.boardVisibilityService.unblockBkw(target.location);
                        this.boardTraverseService.unblockBkw(target.location);
                        break;
                }
            }
        }

        this.boardLightService.updateLightValues();
        this.boardPlayerService.updateAllPlayerTraverse();
    }

    public addWall(target: CellTarget, singleInstance = true) {
        if (!this.hasObstruction(target)) {
            this.wallData.set(target.hash(), target);
            switch (target.region) {
                case CellRegion.TOP_EDGE:
                    this.boardVisibilityService.blockNorth(target.location);
                    this.boardTraverseService.blockNorth(target.location);
                    break;
                case CellRegion.LEFT_EDGE:
                    this.boardVisibilityService.blockWest(target.location);
                    this.boardTraverseService.blockWest(target.location);
                    break;
                case CellRegion.FWRD_EDGE:
                    this.boardVisibilityService.blockFwd(target.location);
                    this.boardTraverseService.blockFwd(target.location);
                    break;
                case CellRegion.BKWD_EDGE:
                    this.boardVisibilityService.blockBkw(target.location);
                    this.boardTraverseService.blockBkw(target.location);
                    break;
            }
        }
        if (singleInstance) {
            this.boardLightService.updateLightValues();
            this.boardPlayerService.updateAllPlayerTraverse();
        }
    }

    public removeWall(target: CellTarget, singleInstance = true): void {
        if (this.hasObstruction(target) && this.wallData.has(target.hash())) {
            this.wallData.delete(target.hash());
            switch (target.region) {
                case CellRegion.TOP_EDGE:
                    this.boardVisibilityService.unblockNorth(target.location);
                    this.boardTraverseService.unblockNorth(target.location);
                    break;
                case CellRegion.LEFT_EDGE:
                    this.boardVisibilityService.unblockWest(target.location);
                    this.boardTraverseService.unblockWest(target.location);
                    break;
                case CellRegion.FWRD_EDGE:
                    this.boardVisibilityService.unblockFwd(target.location);
                    this.boardTraverseService.unblockFwd(target.location);
                    break;
                case CellRegion.BKWD_EDGE:
                    this.boardVisibilityService.unblockBkw(target.location);
                    this.boardTraverseService.unblockBkw(target.location);
                    break;
            }
        }
        if (singleInstance) {
            this.boardLightService.updateLightValues();
            this.boardPlayerService.updateAllPlayerTraverse();
        }
    }

    public toggleWall(target: CellTarget): void {
        if (this.hasObstruction(target) && this.wallData.has(target.hash())) {
            this.removeWall(target);
        } else {
            this.addWall(target);
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
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellRegion.LEFT_EDGE), false);
            }
        }
        // handle down
        if ((delta_x === 0) && (delta_y > 0)) {
            while (currentCell.y !== corner2.y) {
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellRegion.LEFT_EDGE), false);
                currentCell.y++;
            }
        }
        // handle left
        if ((delta_x < 0) && (delta_y === 0)) {
            while (currentCell.x !== corner2.x) {
                currentCell.x--;
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellRegion.TOP_EDGE), false);
            }
        }
        // handle right
        if ((delta_x > 0) && (delta_y === 0)) {
            while (currentCell.x !== corner2.x) {
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellRegion.TOP_EDGE), false);
                currentCell.x++;
            }
        }
        // handle up/right
        if ((delta_x > 0) && (delta_y < 0)) {
            while (currentCell.x !== corner2.x) {
                currentCell.y--;
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellRegion.FWRD_EDGE), false);
                currentCell.x++;
            }
        }
        // handle down/right
        if ((delta_x > 0) && (delta_y > 0)) {
            while (currentCell.x !== corner2.x) {
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellRegion.BKWD_EDGE), false);
                currentCell.y++;
                currentCell.x++;
            }
        }
        // handle down/left
        if ((delta_x < 0) && (delta_y > 0)) {
            while (currentCell.x !== corner2.x) {
                currentCell.x--;
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellRegion.FWRD_EDGE), false);
                currentCell.y++;
            }
        }
        // handle up/left
        if ((delta_x < 0) && (delta_y < 0)) {
            while (currentCell.x !== corner2.x) {
                currentCell.x--;
                currentCell.y--;
                this.addWall(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellRegion.BKWD_EDGE), false);
            }
        }
        this.boardLightService.updateLightValues();
        this.boardPlayerService.updateAllPlayerTraverse();
    }

    public hasObstruction(target: CellTarget): boolean {
        return this.wallData.has(target.hash()) || this.doorData.has(target.hash()) || this.windowData.has(target.hash());
    }
}
