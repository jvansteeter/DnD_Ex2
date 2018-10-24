import {Injectable} from '@angular/core';
import {ViewMode} from '../shared/enum/view-mode';
import {BoardMode} from '../shared/enum/board-mode';
import {LightValue} from '../../../../../shared/types/encounter/board/light-value';
import {CellTarget} from "../shared/cell-target";
import {XyPair} from "../../../../../shared/types/encounter/board/xy-pair";
import {PlayerVisibilityMode} from '../../../../../shared/types/encounter/board/player-visibility-mode';
import {EncounterService} from '../../encounter/encounter.service';
import {IsReadyService} from "../../utilities/services/isReady.service";
import {Line} from "../geometry/line";
import {BoardControllerMode} from "../shared/enum/board-controller-mode";
import {RightsService} from "../../data-services/rights.service";

/*************************************************************************************************************************************
 * BoardStateService
 *************************************************************************************************************************************
 * RESPONSIBLE FOR ...
 * --- being a global model for all the shared variables used by the various board services
 */

@Injectable()
export class BoardStateService extends IsReadyService {

    static cell_res = 50;
    static num_pixels = 0;


    /*************************************************************************************************************************************
     * LOCAL - Controller Config Variables
     *************************************************************************************************************************************/
    public showGridControls: boolean;
    public showHealthBarControls: boolean;
    public showShowWallsToPlayerControls: boolean;
    public showMapEnabledControls: boolean;

    /*************************************************************************************************************************************
     * LOCAL - Misc.
     *************************************************************************************************************************************/
    public visibilityHighlightEnabled = true;

    /*************************************************************************************************************************************
     * LOCAL - diagnostic variables, not intended for production code
     *************************************************************************************************************************************/
    public diag_mode = false;
    public diag_visibility_ray_count = 500;
    public diag_show_visibility_blocking_bitmap = false;
    public diag_layer_opacity = 75;

    /*************************************************************************************************************************************
     * LOCAL - Transform
     *************************************************************************************************************************************/
    public x_offset = 0;
    public y_offset = 0;
    public scale = 1.0;
    public maxZoom = 2.5;        // default: 2.50
    public minZoom = 0.35;
    public mapOffsetTop: number;
    public mapOffsetLeft: number;

    // board-map controls
    public isGM = false;
    public board_controller_mode: BoardControllerMode = BoardControllerMode.DEFAULT;
    public board_edit_mode: BoardMode = BoardMode.PLAYER;
    public board_view_mode: ViewMode = ViewMode.PLAYER;
    public board_maker_map_opacity = 1.0;
    public doDiagonals = true;
    public do_pops = true;
    public isEditingNotation = false;

    public inputOffset = 0.2;    // offset used for input boundaries
    public gridEnabled = true;

    /*************************************************************************************************************************************
     * LOCAL - Mouse Location
     *************************************************************************************************************************************/
    public mouse_loc_screen: XyPair;       // the pixel location of the mouse relative to the screen
    public mouse_loc_canvas: XyPair;       // the pixel location of the mouse relative to the window
    public mouse_loc_map: XyPair;
    public mouse_loc_cell: XyPair;         // the board_grid location the cell under the mouse
    public mouse_loc_cell_pix: XyPair;     // the pixel location of the mouse relative to the current tile

    public mouse_cell_target: CellTarget;  // to current cell target under the pointer
    public mouse_right_cell_target: CellTarget;
    public mouseOnMap = false;
    public source_click_location: CellTarget;

    /*************************************************************************************************************************************
     * LOCAL - Notation
     *************************************************************************************************************************************/
    public brush_size = 0;
    public do_visibility_brush = false;

    /*************************************************************************************************************************************
     * LOCAL - Key States
     *************************************************************************************************************************************/
    public shiftDown = false;
    public spaceDown = false;
    public mouseLeftDown = false;
    public mouseMiddleDown = false;
    public ctrlDown = false;
    public altDown = false;
    public mouseDrag = false;


    static distanceCellToCell(cell1: XyPair, cell2: XyPair): number {
        const delta_y = Math.abs(cell2.y - cell1.y);
        const delta_x = Math.abs(cell2.x - cell1.x);
        const delta_delta = Math.abs(delta_y - delta_x);
        const small_delta = Math.min(delta_x, delta_y);
        const double_step = Math.floor(small_delta / 2);
        const reg_step = small_delta - double_step;
        return (2 * double_step) + reg_step + delta_delta;
    }

    public pixelPointInBounds(pixPoint: XyPair): boolean {
        const mapResX = this.mapDimX * BoardStateService.cell_res;
        const mapResY = this.mapDimY * BoardStateService.cell_res;

        if (pixPoint.x >= 0 && pixPoint.y >= 0) {
            if (pixPoint.x < mapResX && pixPoint.y < mapResY) {
                return true;
            }
        }
        return false;
    }

    constructor(
        private encounterService: EncounterService,
        private rightsService: RightsService,
    ) {
        super(encounterService, rightsService);
        this.init();
    }

    public init(): void {
        this.dependenciesReady().subscribe((isReady: boolean) => {
            if (isReady) {
                if (this.rightsService.isEncounterGM()) {
                    this.isGM = true;
                    this.set_viewMode_gameMaster();
                }

                switch (this.board_view_mode) {
                    case ViewMode.PLAYER:
                        this.showGridControls = true;
                        break;
                    case ViewMode.MASTER:
                        this.showGridControls = true;
                        break;
                    case ViewMode.BOARD_MAKER:
                        this.showGridControls = true;
                        break;
                }

                BoardStateService.num_pixels = this.mapDimX * this.mapDimY * BoardStateService.cell_res ** 2;

                this.setReady(true);
            }
        });
    }

    coorInBounds(x: number, y: number): boolean {
        return !((x >= this.mapDimX) || (y >= this.mapDimY) || (x < 0) || (y < 0));
    }

    calcCellsWithinRangeOfCell(source_cell: XyPair, range: number): Array<XyPair> {
        const returnMe = Array<XyPair>();

        let x_low = source_cell.x - range;
        if (x_low < 0) {
            x_low = 0;
        }
        let x_high = source_cell.x + range;
        if (x_high >= this.mapDimX) {
            x_high = this.mapDimX - 1;
        }
        let y_low = source_cell.y - range;
        if (y_low < 0) {
            y_low = 0;
        }
        let y_high = source_cell.y + range;
        if (y_high >= this.mapDimY) {
            y_high = this.mapDimY - 1;
        }

        for (let x = x_low; x <= x_high; x++) {
            for (let y = y_low; y <= y_high; y++) {
                const cell = new XyPair(x, y);
                if (BoardStateService.distanceCellToCell(source_cell, cell) <= range) {
                    returnMe.push(cell);
                }
            }
        }
        return returnMe;
    }

    get mapDimX(): number {
        return this.encounterService.mapDimX;
    }

    get mapDimY(): number {
        return this.encounterService.mapDimY;
    }

    get xBoundLine(): Line {
        const xRes = this.mapDimX * BoardStateService.cell_res - 1;
        return new Line(new XyPair(xRes, 0), new XyPair(xRes, 1));
    }

    get yBoundLine(): Line {
        const yRes = this.mapDimY * BoardStateService.cell_res - 1;
        return new Line(new XyPair(0, yRes), new XyPair(1, yRes));
    }

    /*************************************************************************************************************************************
     * VIEW/EDIT MODE CONTROLLER VARIABLES/FUNCTIONS
     *************************************************************************************************************************************/
    public set_viewMode_boardMaker()
    {
        this.source_click_location = null;
        this.board_view_mode = ViewMode.BOARD_MAKER;
        this.board_edit_mode = BoardMode.WALLS;
        this.do_pops = false;

        this.showGridControls = true;
        this.showHealthBarControls = true;
        this.showShowWallsToPlayerControls = true;
        this.showMapEnabledControls = true;
    }

    public set_viewMode_player() {
        this.source_click_location = null;
        this.board_view_mode = ViewMode.PLAYER;
        this.board_edit_mode = BoardMode.PLAYER;
        this.do_pops = true;
        this.encounterService.config.showHealth = false;

        this.showGridControls = true;
        this.showHealthBarControls = false;
        this.showShowWallsToPlayerControls = false;
        this.showMapEnabledControls = false;
    }

    public set_viewMode_gameMaster() {
        this.source_click_location = null;
        this.board_view_mode = ViewMode.MASTER;
        this.board_edit_mode = BoardMode.PLAYER;
        this.do_pops = true;

        this.showGridControls = true;
        this.showHealthBarControls = true;
        this.showShowWallsToPlayerControls = true;
        this.showMapEnabledControls = true;
    }

    public set_inputMode_player() {
        this.source_click_location = null;
        this.board_edit_mode = BoardMode.PLAYER;
        this.doDiagonals = false;
        this.inputOffset = 0;
    }

    public set_inputMode_door() {
        this.source_click_location = null;
        this.board_edit_mode = BoardMode.DOORS;
        this.inputOffset = 0.10;
        this.doDiagonals = true;
    }

    public set_inputMode_walls() {
        this.board_edit_mode = BoardMode.WALLS;
        this.inputOffset = 0.2;
        this.doDiagonals = true;
    }

    public set_inputMode_lights() {
        this.source_click_location = null;
        this.board_edit_mode = BoardMode.LIGHTS;
        this.inputOffset = 0;
        this.doDiagonals = false;
    }
}
