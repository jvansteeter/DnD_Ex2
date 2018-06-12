import {Injectable} from '@angular/core';
import {ViewMode} from '../shared/view-mode';
import {BoardMode} from '../shared/board-mode';
import {LightValue} from '../shared/light-value';
import {CellTarget} from "../shared/cell-target";
import {XyPair} from "../geometry/xy-pair";

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
    public cell_res = 50;
    public mapDimX = 28;
    public mapDimY = 22;

    // board-map controls
    public map_enabled = false;
    public playerWallsEnabled = false;
    public lightEnabled = false;
    public ambientLight = LightValue.DARK;

    /***********************************************************************************
     * To keep in the local board state
     ***********************************************************************************/
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

    public inputOffset = 0.2;    // offset used for input boundaries
    public gridEnabled = true;
    public show_health = true;

    // mouse coor variables
    public mouse_loc_screen: XyPair;       // the pixel coor of the mouse relative to the screen
    public mouse_loc_canvas: XyPair;       // the pixel coor of the mouse relative to the window
    public mouse_loc_map: XyPair;
    public mouse_loc_cell: XyPair;         // the board_grid coor the cell under the mouse
    public mouse_loc_cell_pix: XyPair;     // the pixel coor of the mouse relative to the current tile
    public mouse_cell_target: CellTarget;  // to current cell target under the pointer

    // key states
    public mouseOnMap = false;
    public shiftDown = false;
    public spaceDown = false;
    public mouseLeftDown = false;
    public mouseDrag = false;
    source_click_location: CellTarget;
    mouseLeftDownStartTime: number;


    constructor() {}

}
