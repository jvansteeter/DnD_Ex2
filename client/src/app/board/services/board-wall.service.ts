import {Injectable} from '@angular/core';
import {Wall} from '../map-objects/wall';
import {XyPair} from '../geometry/xy-pair';
import {CellTarget} from '../shared/cell-target';
import {CellRegion} from '../shared/enum/cell-region';
import {BoardStateService} from './board-state.service';
import {BoardVisibilityService} from './board-visibility.service';
import {BoardTraverseService} from './board-traverse.service';
import {BoardLightService} from './board-light.service';
import {LightSource} from '../map-objects/light-source';
import {MapRendererComponent} from '../renderer/map-renderer/map-renderer.component';

@Injectable()
export class BoardWallService {
    public wallData: Map<string, Wall> = new Map();

    constructor(
        private boardStateService: BoardStateService,
        private boardVisibilityService: BoardVisibilityService,
        private boardTraverseService: BoardTraverseService,
        private boardLightService: BoardLightService
    ) {}

    public dev_mode_init() {
        if (MapRendererComponent.DEV_MAP_URL_STRING === 'resources/images/maps/shack.jpg') {
            // top wall
            this.addWall(new CellTarget(new XyPair(5, 2), CellRegion.TOP_EDGE));
            this.addWall(new CellTarget(new XyPair(6, 2), CellRegion.TOP_EDGE));
            this.addWall(new CellTarget(new XyPair(7, 2), CellRegion.TOP_EDGE));

            // right wall
            this.addWall(new CellTarget(new XyPair(8, 2), CellRegion.LEFT_EDGE));
            this.addWall(new CellTarget(new XyPair(8, 3), CellRegion.LEFT_EDGE));
            this.addWall(new CellTarget(new XyPair(8, 4), CellRegion.LEFT_EDGE));
            this.addWall(new CellTarget(new XyPair(8, 5), CellRegion.LEFT_EDGE));

            // bottom wall
            this.addWall(new CellTarget(new XyPair(7, 6), CellRegion.TOP_EDGE));
            this.addWall(new CellTarget(new XyPair(6, 6), CellRegion.TOP_EDGE));
            this.addWall(new CellTarget(new XyPair(5, 6), CellRegion.TOP_EDGE));

            // left wall
            this.addWall(new CellTarget(new XyPair(5, 5), CellRegion.LEFT_EDGE));
            this.addWall(new CellTarget(new XyPair(5, 4), CellRegion.LEFT_EDGE));
            // this.addWall(new CellTarget(new XyPair(5, 3), CellRegion.LEFT_EDGE));              // DOOR
            this.addWall(new CellTarget(new XyPair(5, 2), CellRegion.LEFT_EDGE));
            }
    }

    public addWall(loc: CellTarget, singleInstance = true) {
        if (!this.hasWall(loc)) {
            this.wallData.set(loc.hash(), new Wall(loc, BoardStateService.cell_res));
            switch (loc.region) {
                case CellRegion.TOP_EDGE:
                    this.boardVisibilityService.blockNorth(loc.location);
                    this.boardTraverseService.blockNorth(loc.location);
                    break;
                case CellRegion.LEFT_EDGE:
                    this.boardVisibilityService.blockWest(loc.location);
                    this.boardTraverseService.blockWest(loc.location);

                    break;
                case CellRegion.FWRD_EDGE:
                    this.boardVisibilityService.blockFwd(loc.location);
                    this.boardTraverseService.blockFwd(loc.location);

                    break;
                case CellRegion.BKWD_EDGE:
                    this.boardVisibilityService.blockBkw(loc.location);
                    this.boardTraverseService.blockBkw(loc.location);

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
            switch (loc.region) {
                case CellRegion.TOP_EDGE:
                    this.boardVisibilityService.unblockNorth(loc.location);
                    this.boardTraverseService.unblockNorth(loc.location);
                    break;
                case CellRegion.LEFT_EDGE:
                    this.boardVisibilityService.unblockWest(loc.location);
                    this.boardTraverseService.unblockWest(loc.location);

                    break;
                case CellRegion.FWRD_EDGE:
                    this.boardVisibilityService.unblockFwd(loc.location);
                    this.boardTraverseService.unblockFwd(loc.location);

                    break;
                case CellRegion.BKWD_EDGE:
                    this.boardVisibilityService.unblockBkw(loc.location);
                    this.boardTraverseService.unblockBkw(loc.location);

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
    }

    public hasWall(loc: CellTarget): boolean {
        return this.wallData.has(loc.hash());
    }
}
