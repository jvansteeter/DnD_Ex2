import {Injectable} from '@angular/core';
import {ViewMode} from '../shared/enum/view-mode';
import {BoardMode} from '../shared/enum/board-mode';
import {LightValue} from '../shared/enum/light-value';
import {CellTarget} from "../shared/cell-target";
import {XyPair} from "../geometry/xy-pair";
import {PlayerVisibilityMode} from '../shared/enum/player-visibility-mode';
import {NotationMode} from '../shared/enum/notation-mode';

/*************************************************************************************************************************************
 * BoardStateService
 *************************************************************************************************************************************
 * RESPONSIBLE FOR ...
 * --- being a global model for all the shared variables used by the various board services
 */

@Injectable()
export class BoardStateService {

    /***********************************************************************************
     * To be moved into encounter state
     ***********************************************************************************/
    static cell_res = 50;
    public mapDimX = 10;
    public mapDimY = 8;

    // board-map controls
    public map_enabled = false;
    public playerWallsEnabled = false;
    public lightEnabled = false;
    public ambientLight = LightValue.DARK;
    public playerVisibilityMode = PlayerVisibilityMode.GLOBAL;
    public notationMode = NotationMode.SELECT;

    /***********************************************************************************
     * To keep in the local board state
     ***********************************************************************************/
    public visibilityHighlightEnabled = true;

    public mapOffsetTop: number;
    public mapOffsetLeft: number;

    // transform state
    public x_offset = 0;
    public y_offset = 0;
    public scale = 1.0;

    // board-map controls
    public board_edit_mode: BoardMode = BoardMode.PLAYER;
    public board_view_mode: ViewMode = ViewMode.BOARD_MAKER;
    public board_maker_map_opacity = 1.0;
    public doDiagonals = true;
    public do_pops = false;
    public notationModeEnabled = true;

    public inputOffset = 0.2;    // offset used for input boundaries
    public gridEnabled = true;
    public show_health = true;

    // mouse location variables
    public mouse_loc_screen: XyPair;       // the pixel location of the mouse relative to the screen
    public mouse_loc_canvas: XyPair;       // the pixel location of the mouse relative to the window
    public mouse_loc_map: XyPair;
    public mouse_loc_cell: XyPair;         // the board_grid location the cell under the mouse
    public mouse_loc_cell_pix: XyPair;     // the pixel location of the mouse relative to the current tile

    public mouse_cell_target: CellTarget;  // to current cell target under the pointer
    public mouse_right_cell_target: CellTarget;

    // key states
    public mouseOnMap = false;

    public shiftDown = false;
    public spaceDown = false;

    public mouseLeftDown = false;
    public mouseMiddleDown = false;

    public mouseDrag = false;
    source_click_location: CellTarget;


    static distanceCellToCell(cell1: XyPair, cell2: XyPair): number {
        const delta_y = Math.abs(cell2.y - cell1.y);
        const delta_x = Math.abs(cell2.x - cell1.x);
        const delta_delta = Math.abs(delta_y - delta_x);
        const small_delta = Math.min(delta_x, delta_y);
        const double_step = Math.floor(small_delta / 2);
        const reg_step = small_delta - double_step;
        return (2 * double_step) + reg_step + delta_delta;
    }

    constructor() {}

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
        if (x_high > this.mapDimX) {
            x_high = this.mapDimX;
        }
        let y_low = source_cell.y - range;
        if (y_low < 0) {
            y_low = 0;
        }
        let y_high = source_cell.y + range;
        if (y_high > this.mapDimY) {
            y_high = this.mapDimY;
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

}
