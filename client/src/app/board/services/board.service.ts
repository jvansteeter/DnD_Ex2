import {Injectable} from '@angular/core';
import {XyPair} from '../geometry/xy-pair';
import {CellLightConfig} from '../shared/cell-light-state';
import {CellTarget} from '../shared/cell-target';
import {CellZone} from '../shared/cell-zone';
import {isNullOrUndefined} from 'util';
import {BoardMode} from '../shared/board-mode';
import {LightSource} from '../map-objects/light-source';
import {LightValue} from '../shared/light-value';
import {BoardConfigService} from './board-config.service';
import {WallService} from './wall.service';
import {BoardCanvasService} from './board-canvas-service';
import {TileService} from './tile.service';
import {ViewMode} from '../shared/view-mode';

/*************************************************************************************************************************************
 * BoardConfigService
 *************************************************************************************************************************************
 * RESPONSIBLE FOR ...
 *
 *
 *
 * GENERAL NOTES
 * --- When it comes to locating things on the screen, there are a handful of coordinate systems
 *     to be aware of. Variables and/or functions that require/return a specific value in a given
 *     coordinate scope will suffix the varible/function in an identifier for that scope
 *     --- '_screen': refers to the pixel coor on the screen, considered global
 *     --- '_canvas': refers to the pixel coor on the mapCanvas, relative to its top corner
 *     --- '_map'   : refers to the pixel coor on the map, influenced by map transforms
 *     --- '_cell'  : refers to a simple tile on the board-map. By taking the global 'squareSize' and
 *                    multiplying by the '_cell's X and Y values, one would get the '_canvas' value
 *                    for the cell
 *     --- 'cell_pix' : refers to the pixel coordinate within the cell
 */

@Injectable()
export class BoardService {

  public cellLightData: Array<Array<CellLightConfig>>;
  public lightSourceData: Map<string, LightSource> = new Map();

  // light
  public ambientLight: LightValue;

  // mouse coor variables
  mouse_loc_screen: XyPair;       // the pixel coor of the mouse relative to the screen
  mouse_loc_canvas: XyPair;       // the pixel coor of the mouse relative to the window
  mouse_loc_map: XyPair;
  mouse_loc_cell: XyPair;         // the board_grid coor the cell under the mouse
  mouse_loc_cell_pix: XyPair;     // the pixel coor of the mouse relative to the current tile
  mouse_cell_target: CellTarget;  // to current cell target under the pointer

  // input control
  source_click_location: CellTarget;
  mouseOnMap = false;
  shiftDown = false;
  spaceDown = false;
  mouseDown = false;
  mouseDrag = false;
  mouseDownStartTime: number;

  constructor(public bcs: BoardConfigService,
              public bctx: BoardCanvasService,
              private wall_service: WallService,
              private tile_service: TileService) {
    this.cellLightData = new Array(this.bcs.mapDimX);
    for (let x = 0; x < this.bcs.mapDimX; x++) {
      this.cellLightData[x] = new Array(this.bcs.mapDimY);
      for (let y = 0; y < this.bcs.mapDimY; y++) {
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
    this.mouse_loc_screen = location;
    this.mouse_loc_canvas = this.screen_to_canvas(this.mouse_loc_screen);
    this.mouse_loc_map = this.screen_to_map(this.mouse_loc_screen);
    this.mouse_loc_cell = this.screen_to_cell(this.mouse_loc_screen);
    this.mouse_loc_cell_pix = new XyPair(this.mouse_loc_map.x - (this.mouse_loc_cell.x * this.bcs.cell_res), this.mouse_loc_map.y - (this.mouse_loc_cell.y * this.bcs.cell_res));
    this.mouse_cell_target = this.calculate_cell_target(this.mouse_loc_cell_pix);
    this.mouseOnMap = this.coorInBounds(this.mouse_loc_cell.x, this.mouse_loc_cell.y);
  }

  refreshMouseLocation(): void {
    this.mouse_loc_canvas = this.screen_to_canvas(this.mouse_loc_screen);
    this.mouse_loc_map = this.screen_to_map(this.mouse_loc_screen);
    this.mouse_loc_cell = this.screen_to_cell(this.mouse_loc_screen);
    this.mouse_loc_cell_pix = new XyPair(this.mouse_loc_map.x - (this.mouse_loc_cell.x * this.bcs.cell_res), this.mouse_loc_map.y - (this.mouse_loc_cell.y * this.bcs.cell_res));
    this.mouse_cell_target = this.calculate_cell_target(this.mouse_loc_cell_pix);
    this.mouseOnMap = this.coorInBounds(this.mouse_loc_cell.x, this.mouse_loc_cell.y);
  }

  clearMouseLocation(): void {
    this.mouse_loc_canvas = null;
    this.mouse_loc_map = null;
    this.mouse_loc_cell = null;
    this.mouse_loc_cell_pix = null;
    this.mouse_cell_target = null;
    this.mouseOnMap = false;
  }

  handleMouseScroll(delta: number) {
    const scroll_scale_delta = 0.10;
    const max_scale = 2.50;
    const min_scale = 0.35;

    const start_scale = this.bcs.scale;

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

    const x_delta = -(this.mouse_loc_map.x * new_scale_delta);
    const y_delta = -(this.mouse_loc_map.y * new_scale_delta);

    this.bcs.scale += new_scale_delta;
    this.bcs.x_offset += x_delta;
    this.bcs.y_offset += y_delta;
  }

  handleClickResponse() {
  }

  handleMouseLeave() {
    this.clearMouseLocation();
    this.mouseDown = false;
  }

  handleMouseEnter() {
  }

  handleMouseUp(event) {
    if (!this.mouseDrag) {
      switch (this.bcs.board_view_mode) {
        case ViewMode.MASTER:
          break;
        case ViewMode.PLAYER:
          break;
        case ViewMode.BOARD_MAKER:
          switch (this.bcs.board_edit_mode) {
            case BoardMode.WALLS:

              if (!isNullOrUndefined(this.mouse_cell_target)) {
                if (!isNullOrUndefined(this.source_click_location)) {
                  // MOUSE NOT DRAGGING - WALL EDIT MODE - MOUSE ON MAP - SOURCE IS DEFINED
                  switch (this.mouse_cell_target.zone) {
                    case CellZone.CORNER:
                      this.fillWallsBetweenCorners(this.source_click_location.coor, this.mouse_cell_target.coor);
                      this.updateLightValues();
                      this.source_click_location = this.mouse_cell_target;
                      break;
                    default:
                      this.source_click_location = null;
                  }
                } else {
                  switch (this.mouse_cell_target.zone) {
                    // MOUSE NOT DRAGGING - WALL EDIT MODE - MOUSE ON MAP - SOURCE IS NOT DEFINED
                    case CellZone.CORNER:
                      this.source_click_location = this.mouse_cell_target;
                      break;
                    case CellZone.NORTH:
                      this.source_click_location = null;
                      this.wall_service.toggleWall(this.mouse_cell_target);
                      this.updateLightValues();
                      break;
                    case CellZone.WEST:
                      this.source_click_location = null;
                      this.wall_service.toggleWall(this.mouse_cell_target);
                      this.updateLightValues();
                      break;
                    case CellZone.FWR:
                      this.source_click_location = null;
                      this.wall_service.toggleWall(this.mouse_cell_target);
                      this.updateLightValues();
                      break;
                    case CellZone.BKW:
                      this.source_click_location = null;
                      this.wall_service.toggleWall(this.mouse_cell_target);
                      this.updateLightValues();
                      break;
                  }
                }
              }
              break;
            case BoardMode.DOORS:
              break;
            case BoardMode.LIGHTS:
              if (!isNullOrUndefined(this.mouse_cell_target)) {
                if (this.mouse_cell_target.zone === CellZone.CENTER) {
                  this.toggleLight(this.mouse_cell_target.coor.x, this.mouse_cell_target.coor.y);
                  this.updateLightValues();
                }
              }
              break;
            case BoardMode.TILES:
              if (!isNullOrUndefined(this.mouse_cell_target)) {
                switch (this.mouse_cell_target.zone) {
                  case CellZone.CENTER:
                    this.tile_service.setTileData_All(this.mouse_loc_cell);
                    break;
                  case CellZone.TOP:
                    this.tile_service.setTileData_Top(this.mouse_loc_cell);
                    break;
                  case CellZone.LEFT:
                    this.tile_service.setTileData_Left(this.mouse_loc_cell);
                    break;
                  case CellZone.BOTTOM:
                    this.tile_service.setTileData_Bottom(this.mouse_loc_cell);
                    break;
                  case CellZone.RIGHT:
                    this.tile_service.setTileData_Right(this.mouse_loc_cell);
                    break;
                }
              }
              break;
          }
          break;
      }
    }

    this.mouseDown = false;
    this.mouseDrag = false;
  }

  handleMouseDown(event) {
    this.mouseDown = true;
    this.mouseDownStartTime = window.performance.now();
  }

  handleMouseMove(event) {
    const mouse_screen = new XyPair(event.clientX, event.clientY);

    if (this.mouseDown) {
      if ((window.performance.now() - this.mouseDownStartTime) > 90) {
        this.mouseDrag = true;
        const trans_coor = this.screen_to_map(event);

        const deltaX = this.mouse_loc_map.x - trans_coor.x;
        const deltaY = this.mouse_loc_map.y - trans_coor.y;

        this.bcs.x_offset -= (deltaX * this.bcs.scale);
        this.bcs.y_offset -= (deltaY * this.bcs.scale);
      }
    }

    this.updateMouseLocation(mouse_screen);
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
    if (x_high > this.bcs.mapDimX) {
      x_high = this.bcs.mapDimX;
    }
    let y_low = source_cell.y - range;
    if (y_low < 0) {
      y_low = 0;
    }
    let y_high = source_cell.y + range;
    if (y_high > this.bcs.mapDimY) {
      y_high = this.bcs.mapDimY;
    }

    for (let x = x_low; x < x_high; x++) {
      for (let y = y_low; y < y_high; y++) {
        const cell = new XyPair(x, y);
        if (BoardService.distanceCellToCell(source_cell, cell) <= range) {
          returnMe.push(cell);
        }
      }
    }
    return returnMe;
  }

  genLOSNorthPoints(x_cell: number, y_cell: number): Array<XyPair> {
    const returnMe = Array<XyPair>();
    const _canvas = new XyPair(x_cell * this.bcs.cell_res, y_cell * this.bcs.cell_res);

    returnMe.push(new XyPair(Math.floor(_canvas.x + this.bcs.cell_res * (1 / 3)), Math.floor(_canvas.y + this.bcs.cell_res * (1 / 6))));
    returnMe.push(new XyPair(Math.floor(_canvas.x + this.bcs.cell_res * (2 / 3)), Math.floor(_canvas.y + this.bcs.cell_res * (1 / 6))));
    returnMe.push(new XyPair(Math.floor(_canvas.x + this.bcs.cell_res * (1 / 2)), Math.floor(_canvas.y + this.bcs.cell_res * (2 / 6))));

    return returnMe;
  }

  genLOSEastPoints(x_cell: number, y_cell: number): Array<XyPair> {
    const returnMe = Array<XyPair>();
    const _canvas = new XyPair(x_cell * this.bcs.cell_res, y_cell * this.bcs.cell_res);

    returnMe.push(new XyPair(Math.floor(_canvas.x + this.bcs.cell_res * (5 / 6)), Math.floor(_canvas.y + this.bcs.cell_res * (1 / 3))));
    returnMe.push(new XyPair(Math.floor(_canvas.x + this.bcs.cell_res * (5 / 6)), Math.floor(_canvas.y + this.bcs.cell_res * (2 / 3))));
    returnMe.push(new XyPair(Math.floor(_canvas.x + this.bcs.cell_res * (4 / 6)), Math.floor(_canvas.y + this.bcs.cell_res * (1 / 2))));

    return returnMe;
  }

  genLOSSouthPoints(x_cell: number, y_cell: number): Array<XyPair> {
    const returnMe = Array<XyPair>();
    const _canvas = new XyPair(x_cell * this.bcs.cell_res, y_cell * this.bcs.cell_res);

    returnMe.push(new XyPair(Math.floor(_canvas.x + this.bcs.cell_res * (1 / 3)), Math.floor(_canvas.y + this.bcs.cell_res * (5 / 6))));
    returnMe.push(new XyPair(Math.floor(_canvas.x + this.bcs.cell_res * (2 / 3)), Math.floor(_canvas.y + this.bcs.cell_res * (5 / 6))));
    returnMe.push(new XyPair(Math.floor(_canvas.x + this.bcs.cell_res * (1 / 2)), Math.floor(_canvas.y + this.bcs.cell_res * (4 / 6))));

    return returnMe;
  }

  genLOSWestPoints(x_cell: number, y_cell: number): Array<XyPair> {
    const returnMe = Array<XyPair>();
    const _canvas = new XyPair(x_cell * this.bcs.cell_res, y_cell * this.bcs.cell_res);

    returnMe.push(new XyPair(Math.floor(_canvas.x + this.bcs.cell_res * (1 / 6)), Math.floor(_canvas.y + this.bcs.cell_res * (1 / 3))));
    returnMe.push(new XyPair(Math.floor(_canvas.x + this.bcs.cell_res * (1 / 6)), Math.floor(_canvas.y + this.bcs.cell_res * (2 / 3))));
    returnMe.push(new XyPair(Math.floor(_canvas.x + this.bcs.cell_res * (2 / 6)), Math.floor(_canvas.y + this.bcs.cell_res * (1 / 2))));

    return returnMe;
  }

  cellHasLOSToNorth(origin_cell: XyPair, target_cell: XyPair): boolean {
    const origin_point = new XyPair(origin_cell.x * this.bcs.cell_res + this.bcs.cell_res / 2, origin_cell.y * this.bcs.cell_res + this.bcs.cell_res / 2);
    const target_points = this.genLOSNorthPoints(target_cell.x, target_cell.y);
    let traceCount = 0;
    for (const target_point of target_points) {
      if (this.losTrace(origin_point, target_point)) {
        traceCount++;
      }
    }
    return traceCount >= this.bcs.traceHitCountForVisibility;
  }

  cellHasLOSToEast(origin_cell: XyPair, target_cell: XyPair): boolean {
    const origin_point = new XyPair(origin_cell.x * this.bcs.cell_res + this.bcs.cell_res / 2, origin_cell.y * this.bcs.cell_res + this.bcs.cell_res / 2);
    const target_points = this.genLOSEastPoints(target_cell.x, target_cell.y);
    let traceCount = 0;
    for (const target_point of target_points) {
      if (this.losTrace(origin_point, target_point)) {
        traceCount++;
      }
    }
    return traceCount >= this.bcs.traceHitCountForVisibility;
  }

  cellHasLOSToSouth(origin_cell: XyPair, target_cell: XyPair): boolean {
    const origin_point = new XyPair(origin_cell.x * this.bcs.cell_res + this.bcs.cell_res / 2, origin_cell.y * this.bcs.cell_res + this.bcs.cell_res / 2);
    const target_points = this.genLOSSouthPoints(target_cell.x, target_cell.y);
    let traceCount = 0;
    for (const target_point of target_points) {
      if (this.losTrace(origin_point, target_point)) {
        traceCount++;
      }
    }
    return traceCount >= this.bcs.traceHitCountForVisibility;
  }

  cellHasLOSToWest(origin_cell: XyPair, target_cell: XyPair): boolean {
    const origin_point = new XyPair(origin_cell.x * this.bcs.cell_res + this.bcs.cell_res / 2, origin_cell.y * this.bcs.cell_res + this.bcs.cell_res / 2);
    const target_points = this.genLOSWestPoints(target_cell.x, target_cell.y);
    let traceCount = 0;
    for (const target_point of target_points) {
      if (this.losTrace(origin_point, target_point)) {
        traceCount++;
      }
    }
    return traceCount >= this.bcs.traceHitCountForVisibility;
  }

  // *************************************************************************************************************************************************************
  // MAP MANIPULATION FUNCTIONS
  // *************************************************************************************************************************************************************
  fillWallsBetweenCorners(corner1: XyPair, corner2: XyPair): void {
    const delta_x = corner2.x - corner1.x;
    const delta_y = corner2.y - corner1.y;
    const currentCell = corner1;

    // handle up
    if ((delta_x === 0) && (delta_y < 0)) {
      while (currentCell.y !== corner2.y) {
        currentCell.y--;

        const target: CellTarget = new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.WEST);
        this.wall_service.addWall(target);
      }
    }
    // handle down
    if ((delta_x === 0) && (delta_y > 0)) {
      while (currentCell.y !== corner2.y) {
        const target: CellTarget = new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.WEST);
        this.wall_service.addWall(target);

        currentCell.y++;
      }
    }
    // handle left
    if ((delta_x < 0) && (delta_y === 0)) {
      while (currentCell.x !== corner2.x) {
        currentCell.x--;

        const target: CellTarget = new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.NORTH);
        this.wall_service.addWall(target);
      }
    }
    // handle right
    if ((delta_x > 0) && (delta_y === 0)) {
      while (currentCell.x !== corner2.x) {
        const target: CellTarget = new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.NORTH);
        this.wall_service.addWall(target);
        currentCell.x++;
      }
    }
    // handle up/right
    if ((delta_x > 0) && (delta_y < 0)) {
      while (currentCell.x !== corner2.x) {
        currentCell.y--;

        const target: CellTarget = new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.FWR);
        this.wall_service.addWall(target);
        currentCell.x++;
      }
    }
    // handle down/right
    if ((delta_x > 0) && (delta_y > 0)) {
      while (currentCell.x !== corner2.x) {
        const target: CellTarget = new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.BKW);
        this.wall_service.addWall(target);

        currentCell.y++;
        currentCell.x++;
      }
    }
    // handle down/left
    if ((delta_x < 0) && (delta_y > 0)) {
      while (currentCell.x !== corner2.x) {
        currentCell.x--;

        const target: CellTarget = new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.FWR);
        this.wall_service.addWall(target);
        currentCell.y++;
      }
    }
    // handle up/left
    if ((delta_x < 0) && (delta_y < 0)) {
      while (currentCell.x !== corner2.x) {
        currentCell.x--;
        currentCell.y--;

        const target: CellTarget = new CellTarget(new XyPair(currentCell.x, currentCell.y), CellZone.BKW);
        this.wall_service.addWall(target);
      }
    }
  }

  updateLightValues(): void {
    for (let x = 0; x < this.bcs.mapDimX; x++) {
      for (let y = 0; y < this.bcs.mapDimY; y++) {
        // for each cell on the map
        const cell = this.cellLightData[x][y];

        // reset the ambient light values
        cell.light_north = this.bcs.ambientLight;
        cell.light_west = this.bcs.ambientLight;
        cell.light_south = this.bcs.ambientLight;
        cell.light_east = this.bcs.ambientLight;

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
                if (this.cellHasLOSToNorth(light_source.coor, cell.coor)) {
                  cell.updateLightIntensityNorth(light_source.lightImpactAtDistance(dist));
                  north = true;
                }
              }
              if (!east) {
                if (this.cellHasLOSToEast(light_source.coor, cell.coor)) {
                  cell.updateLightIntensityEast(light_source.lightImpactAtDistance(dist));
                  east = true;
                }
              }
              if (!south) {
                if (this.cellHasLOSToSouth(light_source.coor, cell.coor)) {
                  cell.updateLightIntensitySouth(light_source.lightImpactAtDistance(dist));
                  south = true;
                }
              }
              if (!west) {
                if (this.cellHasLOSToWest(light_source.coor, cell.coor)) {
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

  losTrace(origin_canvas: XyPair, target_canvas: XyPair): boolean {
    return this.wall_service.rayCast(origin_canvas, target_canvas);
  }


  // *************************************************************************************************************************************************************
  // COORDINATE TRANSFORM FUNCTIONS
  // *************************************************************************************************************************************************************

  /**
   * takes the mouse position in terms on the monitor, and transforms them
   * to a position relative to the top-left corner of the canvas element
   * @param {XyPair} screenRes
   * @returns {XyPair}
   */
  screen_to_canvas(screenRes: XyPair): XyPair {
    const rect = this.bctx.canvasNativeElement.getBoundingClientRect();
    return new XyPair(screenRes.x - rect.left, screenRes.y - rect.top);
  }

  /**
   * takes the mouse position in terms of the monitor, and transforms them
   * to a position relative to the top-left corner of the MAP itself, impacted by transforms
   * @param {XyPair} screenRes
   * @returns {XyPair}
   */
  screen_to_map(screenRes: XyPair): XyPair {
    const canvasPixel = this.screen_to_canvas(screenRes);
    const mapX = (canvasPixel.x - this.bcs.x_offset) / this.bcs.scale;
    const mapY = (canvasPixel.y - this.bcs.y_offset) / this.bcs.scale;
    return new XyPair(mapX, mapY);
  }

  screen_to_cell(screenRes: XyPair): XyPair {
    const mapPixel = this.screen_to_map(screenRes);

    const cellX = Math.floor(mapPixel.x / this.bcs.cell_res);
    const cellY = Math.floor(mapPixel.y / this.bcs.cell_res);

    return new XyPair(cellX, cellY);
  }

  calculate_cell_target(loc: XyPair): CellTarget {
    const shift = this.bcs.cell_res * this.bcs.inputOffset;

    // CENTER
    if ((loc.x > shift) && (loc.x < (this.bcs.cell_res - shift) && (loc.y > shift) && (loc.y < (this.bcs.cell_res - shift)))) {

      if (this.shiftDown && (this.bcs.board_edit_mode === BoardMode.TILES)) {
        // Handles the isolation of the four triangles
        if (loc.x >= loc.y) {
          // top of cell
          if ((loc.x + loc.y) <= this.bcs.cell_res) {
            // top-left
            return new CellTarget(this.mouse_loc_cell, CellZone.TOP);
          } else {
            // top-right
            return new CellTarget(this.mouse_loc_cell, CellZone.RIGHT);
          }
        } else {
          // bottom of cell
          if ((loc.x + loc.y) <= this.bcs.cell_res) {
            // bottom-left
            return new CellTarget(this.mouse_loc_cell, CellZone.LEFT);
          } else {
            // bottom-right
            return new CellTarget(this.mouse_loc_cell, CellZone.BOTTOM);
          }
        }
      }

      if (this.bcs.doDiagonals) {
        if (loc.x > (this.bcs.cell_res / 2)) {
          // right side
          if (loc.y > (this.bcs.cell_res / 2)) {
            // bottom
            return new CellTarget(this.mouse_loc_cell, CellZone.BKW);
          } else {
            // top
            return new CellTarget(this.mouse_loc_cell, CellZone.FWR);
          }
        } else {
          // left side
          if (loc.y > (this.bcs.cell_res / 2)) {
            // bottom
            return new CellTarget(this.mouse_loc_cell, CellZone.FWR);
          } else {
            // top
            return new CellTarget(this.mouse_loc_cell, CellZone.BKW);
          }
        }
      }

      return new CellTarget(this.mouse_loc_cell, CellZone.CENTER);

    }

    // LEFT/RIGHT
    if ((loc.x <= shift) && (loc.y > shift) && (loc.y < (this.bcs.cell_res - shift))) {
      return new CellTarget(this.mouse_loc_cell, CellZone.WEST);
    }
    if ((loc.x >= (this.bcs.cell_res - shift)) && (loc.y > shift) && (loc.y < (this.bcs.cell_res - shift))) {
      return new CellTarget(new XyPair(this.mouse_loc_cell.x + 1, this.mouse_loc_cell.y), CellZone.WEST);
    }

    // TOP/BOTTOM
    if ((loc.y <= shift) && (loc.x > shift) && (loc.x < (this.bcs.cell_res - shift))) {
      return new CellTarget(this.mouse_loc_cell, CellZone.NORTH);
    }
    if ((loc.y >= (this.bcs.cell_res - shift)) && (loc.x > shift) && (loc.x < (this.bcs.cell_res - shift))) {
      return new CellTarget(new XyPair(this.mouse_loc_cell.x, this.mouse_loc_cell.y + 1), CellZone.NORTH);
    }

    // CORNERS
    if ((loc.x <= shift) && (loc.y <= shift)) {
      return new CellTarget(this.mouse_loc_cell, CellZone.CORNER);
    }
    if ((loc.x <= shift) && (loc.y >= (this.bcs.cell_res - shift))) {
      return new CellTarget(new XyPair(this.mouse_loc_cell.x, this.mouse_loc_cell.y + 1), CellZone.CORNER);
    }
    if ((loc.x >= (this.bcs.cell_res - shift)) && (loc.y <= shift)) {
      return new CellTarget(new XyPair(this.mouse_loc_cell.x + 1, this.mouse_loc_cell.y), CellZone.CORNER);
    }
    if ((loc.x >= (this.bcs.cell_res - shift)) && (loc.y >= (this.bcs.cell_res - shift))) {
      return new CellTarget(new XyPair(this.mouse_loc_cell.x + 1, this.mouse_loc_cell.y + 1), CellZone.CORNER);
    }
  }

  coorInBounds(x: number, y: number): boolean {
    return !((x > this.bcs.mapDimX) || (y > this.bcs.mapDimY) || (x < 0) || (y < 0));
  }
}
