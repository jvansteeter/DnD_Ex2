import {Injectable} from '@angular/core';
import {ViewMode} from '../shared/view-mode';
import {BoardMode} from '../shared/board-mode';
import {LightValue} from '../shared/light-value';

/*************************************************************************************************************************************
 * BoardConfigService
 *************************************************************************************************************************************
 * RESPONSIBLE FOR ...
 */

@Injectable()
export class BoardConfigService {

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
  public board_edit_mode: BoardMode = BoardMode.WALLS;
  public board_view_mode: ViewMode = ViewMode.BOARD_MAKER;
  public gridEnabled = true;
  public playerWallsEnabled = false;
  public lightEnabled = false;
  public traceHitCountForVisibility = 3;
  public do_pops = false;

  public doDiagonals = true;

  public ambientLight = LightValue.DARK;

  public board_maker_map_opacity = 1.0;

  constructor() {}

}
