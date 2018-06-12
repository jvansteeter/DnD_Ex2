import {Injectable} from '@angular/core';
import {XyPair} from '../geometry/xy-pair';
import {CellLightConfig} from '../shared/cell-light-state';
import {CellTarget} from '../shared/cell-target';
import {CellZone} from '../shared/cell-zone';
import {isNullOrUndefined} from 'util';
import {BoardMode} from '../shared/board-mode';
import {LightSource} from '../map-objects/light-source';
import {LightValue} from '../shared/light-value';
import {BoardStateService} from './board-state.service';
import {BoardWallService} from './board-wall.service';
import {BoardCanvasService} from './board-canvas.service';
import {BoardTileService} from './board-tile.service';
import {ViewMode} from '../shared/view-mode';
import { EncounterService } from '../../encounter/encounter.service';
import {BoardTransformService} from './board-transform.service';
import {BoardLosService} from './board-los.service';


@Injectable()
export class BoardService {

    public cellLightData: Array<Array<CellLightConfig>>;
    public lightSourceData: Map<string, LightSource> = new Map();

    // light
    public ambientLight: LightValue;

    // input control
    source_click_location: CellTarget;
    mouseLeftDownStartTime: number;

    constructor(public boardStateService: BoardStateService,
                public boardCanvasService: BoardCanvasService,
                public boardTransformService: BoardTransformService,
                public boardLosService: BoardLosService,
                private boardWallService: BoardWallService,
                private boardTileService: BoardTileService,
                private encounterService: EncounterService) {
        this.cellLightData = new Array(this.boardStateService.mapDimX);
        for (let x = 0; x < this.boardStateService.mapDimX; x++) {
            this.cellLightData[x] = new Array(this.boardStateService.mapDimY);
            for (let y = 0; y < this.boardStateService.mapDimY; y++) {
                this.cellLightData[x][y] = new CellLightConfig(x, y);
            }
        }
    }

    // *************************************************************************************************************************************************************
    // STATIC FUNCTIONS
    // *************************************************************************************************************************************************************
    static distanceCellToCell(cell1: XyPair, cell2: XyPair): number {
        const delta_y = Math.abs(cell2.y - cell1.y);
        const delta_x = Math.abs(cell2.x - cell1.x);
        const delta_delta = Math.abs(delta_y - delta_x);
        const small_delta = Math.min(delta_x, delta_y);
        const double_step = Math.floor(small_delta / 2);
        const reg_step = small_delta - double_step;
        return (2 * double_step) + reg_step + delta_delta;
    }


    // *************************************************************************************************************************************************************
    // EVENT FUNCTIONS
    // *************************************************************************************************************************************************************
    updateMouseLocation(location: XyPair): void {
        // UPDATE GLOBAL MOUSE LOCATIONS
        this.boardStateService.mouse_loc_screen = location;
        this.boardStateService.mouse_loc_canvas = this.boardTransformService.screen_to_canvas(this.boardStateService.mouse_loc_screen);
        this.boardStateService.mouse_loc_map = this.boardTransformService.screen_to_map(this.boardStateService.mouse_loc_screen);
        this.boardStateService.mouse_loc_cell = this.boardTransformService.screen_to_cell(this.boardStateService.mouse_loc_screen);
        this.boardStateService.mouse_loc_cell_pix = new XyPair(this.boardStateService.mouse_loc_map.x - (this.boardStateService.mouse_loc_cell.x * this.boardStateService.cell_res), this.boardStateService.mouse_loc_map.y - (this.boardStateService.mouse_loc_cell.y * this.boardStateService.cell_res));
        this.boardStateService.mouse_cell_target = this.boardTransformService.calculate_cell_target(this.boardStateService.mouse_loc_cell_pix);
        this.boardStateService.mouseOnMap = this.coorInBounds(this.boardStateService.mouse_loc_cell.x, this.boardStateService.mouse_loc_cell.y);
    }

    refreshMouseLocation(): void {
        this.boardStateService.mouse_loc_canvas = this.boardTransformService.screen_to_canvas(this.boardStateService.mouse_loc_screen);
        this.boardStateService.mouse_loc_map = this.boardTransformService.screen_to_map(this.boardStateService.mouse_loc_screen);
        this.boardStateService.mouse_loc_cell = this.boardTransformService.screen_to_cell(this.boardStateService.mouse_loc_screen);
        this.boardStateService.mouse_loc_cell_pix = new XyPair(this.boardStateService.mouse_loc_map.x - (this.boardStateService.mouse_loc_cell.x * this.boardStateService.cell_res), this.boardStateService.mouse_loc_map.y - (this.boardStateService.mouse_loc_cell.y * this.boardStateService.cell_res));
        this.boardStateService.mouse_cell_target = this.boardTransformService.calculate_cell_target(this.boardStateService.mouse_loc_cell_pix);
        this.boardStateService.mouseOnMap = this.coorInBounds(this.boardStateService.mouse_loc_cell.x, this.boardStateService.mouse_loc_cell.y);
    }

    clearMouseLocation(): void {
        this.boardStateService.mouse_loc_canvas = null;
        this.boardStateService.mouse_loc_map = null;
        this.boardStateService.mouse_loc_cell = null;
        this.boardStateService.mouse_loc_cell_pix = null;
        this.boardStateService.mouse_cell_target = null;
        this.boardStateService.mouseOnMap = false;
    }

    handleMouseScroll(delta: number) {
        const scroll_scale_delta = 0.10;
        const max_scale = 2.50;
        const min_scale = 0.35;

        const start_scale = this.boardStateService.scale;

        const preferred_scale_delta = (-delta / 100) * scroll_scale_delta;
        const preferred_new_scale = start_scale + preferred_scale_delta;

        let new_scale_delta;

        if (preferred_new_scale >= max_scale) {
            new_scale_delta = start_scale - max_scale;
        } else if (preferred_new_scale <= min_scale) {
            new_scale_delta = min_scale - start_scale;
        } else {
            new_scale_delta = preferred_scale_delta;
        }

        const x_delta = -(this.boardStateService.mouse_loc_map.x * new_scale_delta);
        const y_delta = -(this.boardStateService.mouse_loc_map.y * new_scale_delta);

        this.boardStateService.scale += new_scale_delta;
        this.boardStateService.x_offset += x_delta;
        this.boardStateService.y_offset += y_delta;
    }

    handleClickResponse() {
    }

    handleMouseLeave() {
        this.clearMouseLocation();
        this.boardStateService.mouseLeftDown = false;
    }

    handleMouseEnter() {
    }

    handleMouseLeftUp(event) {
        if (!this.boardStateService.mouseDrag) {
            switch (this.boardStateService.board_view_mode) {
                case ViewMode.MASTER:
                    switch (this.boardStateService.board_edit_mode) {
                        case BoardMode.PLAYER:
                            this.encounterService.handleClick(this.boardStateService.mouse_loc_cell);
                            break;
                    }
                    break;
                case ViewMode.PLAYER:
                    switch (this.boardStateService.board_edit_mode) {
                        case BoardMode.PLAYER:
                            this.encounterService.handleClick(this.boardStateService.mouse_loc_cell);
                            break;
                    }
                    break;
                case ViewMode.BOARD_MAKER:
                    switch (this.boardStateService.board_edit_mode) {
                        case BoardMode.PLAYER:
                            this.encounterService.handleClick(this.boardStateService.mouse_loc_cell);
                            break;
                        case BoardMode.WALLS:
                            if (!isNullOrUndefined(this.boardStateService.mouse_cell_target)) {
                                if (!isNullOrUndefined(this.source_click_location)) {
                                    // MOUSE NOT DRAGGING - WALL EDIT MODE - MOUSE ON MAP - SOURCE IS DEFINED
                                    switch (this.boardStateService.mouse_cell_target.zone) {
                                        case CellZone.CORNER:
                                            this.boardWallService.fillWallsBetweenCorners(this.source_click_location.coor, this.boardStateService.mouse_cell_target.coor);
                                            this.updateLightValues();
                                            this.source_click_location = this.boardStateService.mouse_cell_target;
                                            break;
                                        default:
                                            this.source_click_location = null;
                                    }
                                } else {
                                    switch (this.boardStateService.mouse_cell_target.zone) {
                                        // MOUSE NOT DRAGGING - WALL EDIT MODE - MOUSE ON MAP - SOURCE IS NOT DEFINED
                                        case CellZone.CORNER:
                                            this.source_click_location = this.boardStateService.mouse_cell_target;
                                            break;
                                        case CellZone.NORTH:
                                            this.source_click_location = null;
                                            this.boardWallService.toggleWall(this.boardStateService.mouse_cell_target);
                                            this.updateLightValues();
                                            break;
                                        case CellZone.WEST:
                                            this.source_click_location = null;
                                            this.boardWallService.toggleWall(this.boardStateService.mouse_cell_target);
                                            this.updateLightValues();
                                            break;
                                        case CellZone.FWR:
                                            this.source_click_location = null;
                                            this.boardWallService.toggleWall(this.boardStateService.mouse_cell_target);
                                            this.updateLightValues();
                                            break;
                                        case CellZone.BKW:
                                            this.source_click_location = null;
                                            this.boardWallService.toggleWall(this.boardStateService.mouse_cell_target);
                                            this.updateLightValues();
                                            break;
                                    }
                                }
                            }
                            break;
                        case BoardMode.DOORS:
                            break;
                        case BoardMode.LIGHTS:
                            if (!isNullOrUndefined(this.boardStateService.mouse_cell_target)) {
                                if (this.boardStateService.mouse_cell_target.zone === CellZone.CENTER) {
                                    this.toggleLight(this.boardStateService.mouse_cell_target.coor.x, this.boardStateService.mouse_cell_target.coor.y);
                                    this.updateLightValues();
                                }
                            }
                            break;
                        case BoardMode.TILES:
                            if (!isNullOrUndefined(this.boardStateService.mouse_cell_target)) {
                                switch (this.boardStateService.mouse_cell_target.zone) {
                                    case CellZone.CENTER:
                                        this.boardTileService.setTileData_All(this.boardStateService.mouse_loc_cell);
                                        break;
                                    case CellZone.TOP:
                                        this.boardTileService.setTileData_Top(this.boardStateService.mouse_loc_cell);
                                        break;
                                    case CellZone.LEFT:
                                        this.boardTileService.setTileData_Left(this.boardStateService.mouse_loc_cell);
                                        break;
                                    case CellZone.BOTTOM:
                                        this.boardTileService.setTileData_Bottom(this.boardStateService.mouse_loc_cell);
                                        break;
                                    case CellZone.RIGHT:
                                        this.boardTileService.setTileData_Right(this.boardStateService.mouse_loc_cell);
                                        break;
                                }
                            }
                            break;
                    }
                    break;
            }
        }

        this.boardStateService.mouseLeftDown = false;
        this.boardStateService.mouseDrag = false;
    }

    handleMouseLeftDown(event) {
        this.boardStateService.mouseLeftDown = true;
        this.mouseLeftDownStartTime = window.performance.now();
    }

    handleMouseRightDown(event) {

    }

    handleMouseRightUp(event) {

    }

    handleMouseMove(event) {
        const mouse_screen = new XyPair(event.clientX, event.clientY);

        if (this.boardStateService.mouseLeftDown) {
            if ((window.performance.now() - this.mouseLeftDownStartTime) > 90) {
                this.boardStateService.mouseDrag = true;
                const trans_coor = this.boardTransformService.screen_to_map(event);

                const deltaX = this.boardStateService.mouse_loc_map.x - trans_coor.x;
                const deltaY = this.boardStateService.mouse_loc_map.y - trans_coor.y;

                this.boardStateService.x_offset -= (deltaX * this.boardStateService.scale);
                this.boardStateService.y_offset -= (deltaY * this.boardStateService.scale);
            }
        }

        this.updateMouseLocation(mouse_screen);


        this.encounterService.checkForPops(
            new XyPair(this.boardStateService.mouse_loc_cell.x, this.boardStateService.mouse_loc_cell.y),
            this.boardTransformService.map_to_screen(new XyPair((this.boardStateService.mouse_loc_cell.x + 1) * this.boardStateService.cell_res,((this.boardStateService.mouse_loc_cell.y) * this.boardStateService.cell_res)))
        );


    }

    // *************************************************************************************************************************************************************
    // UN-CATEGORIZED FUNCTIONS
    // *************************************************************************************************************************************************************

    /**
     * returns an array of XY pairs that represent cells
     * @param source_cell
     * @param range
     * @returns {null}
     */
    calcCellsWithinRangeOfCell(source_cell: XyPair, range: number): Array<XyPair> {
        const returnMe = Array<XyPair>();

        let x_low = source_cell.x - range;
        if (x_low < 0) {
            x_low = 0;
        }
        let x_high = source_cell.x + range;
        if (x_high > this.boardStateService.mapDimX) {
            x_high = this.boardStateService.mapDimX;
        }
        let y_low = source_cell.y - range;
        if (y_low < 0) {
            y_low = 0;
        }
        let y_high = source_cell.y + range;
        if (y_high > this.boardStateService.mapDimY) {
            y_high = this.boardStateService.mapDimY;
        }

        for (let x = x_low; x <= x_high; x++) {
            for (let y = y_low; y <= y_high; y++) {
                const cell = new XyPair(x, y);
                if (BoardService.distanceCellToCell(source_cell, cell) <= range) {
                    returnMe.push(cell);
                }
            }
        }
        return returnMe;
    }

    // *************************************************************************************************************************************************************
    // MAP MANIPULATION FUNCTIONS
    // *************************************************************************************************************************************************************

    updateLightValues(): void {
        for (let x = 0; x < this.boardStateService.mapDimX; x++) {
            for (let y = 0; y < this.boardStateService.mapDimY; y++) {
                // for each cell on the map
                const cell = this.cellLightData[x][y];

                // reset the ambient light values
                cell.light_north = this.boardStateService.ambientLight;
                cell.light_west = this.boardStateService.ambientLight;
                cell.light_south = this.boardStateService.ambientLight;
                cell.light_east = this.boardStateService.ambientLight;

                // set booleans for which cells have been touched
                let north = false;
                let west = false;
                let south = false;
                let east = false;

                // sort light sources by distance to cell, removing any beyond influence distance
                const mapped_light_sources = new Map<number, Array<LightSource>>();
                for (const light_source of Array.from(this.lightSourceData.values())) {
                    const distance = BoardService.distanceCellToCell(new XyPair(cell.coor.x, cell.coor.y), light_source.coor);
                    if (distance <= light_source.dim_range) {
                        if (!mapped_light_sources.has(distance)) {
                            mapped_light_sources.set(distance, new Array<LightSource>());
                        }
                        mapped_light_sources.get(distance).push(light_source);
                    }
                }

                const distances = Array.from(mapped_light_sources.keys()).sort((a, b) => {
                    if (a > b) {
                        return 1;
                    }
                    if (a < b) {
                        return -1;
                    }
                    return 0;
                });

                for (const dist of distances) {
                    for (const light_source of mapped_light_sources.get(dist)) {
                        if (!(north && east && south && west)) {
                            if (!north) {
                                if (this.boardLosService.cellHasLOSToNorth(light_source.coor, cell.coor)) {
                                    cell.updateLightIntensityNorth(light_source.lightImpactAtDistance(dist));
                                    north = true;
                                }
                            }
                            if (!east) {
                                if (this.boardLosService.cellHasLOSToEast(light_source.coor, cell.coor)) {
                                    cell.updateLightIntensityEast(light_source.lightImpactAtDistance(dist));
                                    east = true;
                                }
                            }
                            if (!south) {
                                if (this.boardLosService.cellHasLOSToSouth(light_source.coor, cell.coor)) {
                                    cell.updateLightIntensitySouth(light_source.lightImpactAtDistance(dist));
                                    south = true;
                                }
                            }
                            if (!west) {
                                if (this.boardLosService.cellHasLOSToWest(light_source.coor, cell.coor)) {
                                    cell.updateLightIntensityWest(light_source.lightImpactAtDistance(dist));
                                    west = true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    toggleLight(x: number, y: number): void {
        const target = new CellTarget(new XyPair(x, y), CellZone.CENTER);
        if (this.lightSourceData.has(target.hash())) {
            this.lightSourceData.delete(target.hash());
        } else {
            this.lightSourceData.set(target.hash(), new LightSource(x, y, 5));
        }
    }

    coorInBounds(x: number, y: number): boolean {
        return !((x >= this.boardStateService.mapDimX) || (y >= this.boardStateService.mapDimY) || (x < 0) || (y < 0));
    }
}
