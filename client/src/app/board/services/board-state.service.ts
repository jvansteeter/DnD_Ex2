import {Injectable} from '@angular/core';
import {ViewMode} from '../shared/view-mode';
import {BoardMode} from '../shared/board-mode';
import {LightValue} from '../shared/light-value';
import {CellTarget} from "../shared/cell-target";
import {XyPair} from "../geometry/xy-pair";

/*************************************************************************************************************************************
 * BoardConfigService
 *************************************************************************************************************************************
 * RESPONSIBLE FOR ...
 */

@Injectable()
export class BoardStateService {

    public cell_res = 50;
    public mapDimX = 28;
    public mapDimY = 22;
    // public mapDimX = 3;
    // public mapDimY = 3;
    // public cell_res = 5;

    public mapOffsetTop: number;
    public mapOffsetLeft: number;

    public inputOffset = 0.2;    // offset used for input boundaries

    // transform state
    public x_offset = 0;
    public y_offset = 0;
    public scale = 1.0;

    // board-map controls
    public map_enabled = false;
    public board_edit_mode: BoardMode = BoardMode.PLAYER;
    public board_view_mode: ViewMode = ViewMode.BOARD_MAKER;
    public gridEnabled = true;
    public playerWallsEnabled = false;
    public lightEnabled = false;
    public traceHitCountForVisibility = 3;
    public do_pops = false;

    public doDiagonals = true;

    public ambientLight = LightValue.DARK;

    public board_maker_map_opacity = 1.0;

    // mouse coor variables
    public mouse_loc_screen: XyPair;       // the pixel coor of the mouse relative to the screen
    public mouse_loc_canvas: XyPair;       // the pixel coor of the mouse relative to the window
    public mouse_loc_map: XyPair;
    public mouse_loc_cell: XyPair;         // the board_grid coor the cell under the mouse
    public mouse_loc_cell_pix: XyPair;     // the pixel coor of the mouse relative to the current tile
    public mouse_cell_target: CellTarget;  // to current cell target under the pointer

    public show_health = true;

    constructor() {
    }

}
