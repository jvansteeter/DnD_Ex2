import {Injectable} from '@angular/core';
import {XyPair} from '../geometry/xy-pair';
import {BoardStateService} from './board-state.service';
import {BoardCanvasService} from './board-canvas.service';
import {CellTarget} from '../shared/cell-target';
import {BoardMode} from '../shared/enum/board-mode';
import {CellRegion} from '../shared/enum/cell-region';

@Injectable()
export class BoardTransformService {

    constructor(
        private boardStateService: BoardStateService,
        private boardCanvasService: BoardCanvasService
    ) {}

    /*************************************************************************************************************************************
     * BoardTransformService
     **************************************************************************************************************************************
     * GENERAL NOTES
     *
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

    /**
     * takes the mouse position in terms on the monitor, and transforms them
     * to a position relative to the top-left corner of the canvas element
     * @param {XyPair} screenRes
     * @returns {XyPair}
     */
    screen_to_canvas(screenRes: XyPair): XyPair {
        const rect = this.boardCanvasService.canvasNativeElement.getBoundingClientRect();
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
        const mapX = (canvasPixel.x - this.boardStateService.x_offset) / this.boardStateService.scale;
        const mapY = (canvasPixel.y - this.boardStateService.y_offset) / this.boardStateService.scale;
        return new XyPair(mapX, mapY);
    }

    screen_to_cell(screenRes: XyPair): XyPair {
        const mapPixel = this.screen_to_map(screenRes);

        const cellX = Math.floor(mapPixel.x / this.boardStateService.cell_res);
        const cellY = Math.floor(mapPixel.y / this.boardStateService.cell_res);

        return new XyPair(cellX, cellY);
    }

    map_to_canvas(mapRes: XyPair): XyPair {
        const canvasX = (mapRes.x * this.boardStateService.scale) + this.boardStateService.x_offset;
        const canvasY = (mapRes.y * this.boardStateService.scale) + this.boardStateService.y_offset;
        return new XyPair(canvasX, canvasY);
    }

    map_to_screen(mapRes: XyPair): XyPair {
        const canvas = this.map_to_canvas(mapRes);
        const bound = this.boardCanvasService.canvasNativeElement.getBoundingClientRect();

        const screenX = canvas.x + bound.left;
        const screenY = canvas.y + bound.top;
        return new XyPair(screenX, screenY);
    }

    calculate_cell_target(loc: XyPair): CellTarget {
        const shift = this.boardStateService.cell_res * this.boardStateService.inputOffset;

        // CENTER
        if ((loc.x > shift) && (loc.x < (this.boardStateService.cell_res - shift) && (loc.y > shift) && (loc.y < (this.boardStateService.cell_res - shift)))) {

            if (this.boardStateService.shiftDown && (this.boardStateService.board_edit_mode === BoardMode.TILES)) {
                // Handles the isolation of the four triangles
                if (loc.x >= loc.y) {
                    // top of cell
                    if ((loc.x + loc.y) <= this.boardStateService.cell_res) {
                        // top-left
                        return new CellTarget(this.boardStateService.mouse_loc_cell, CellRegion.TOP);
                    } else {
                        // top-right
                        return new CellTarget(this.boardStateService.mouse_loc_cell, CellRegion.RIGHT);
                    }
                } else {
                    // bottom of cell
                    if ((loc.x + loc.y) <= this.boardStateService.cell_res) {
                        // bottom-left
                        return new CellTarget(this.boardStateService.mouse_loc_cell, CellRegion.LEFT);
                    } else {
                        // bottom-right
                        return new CellTarget(this.boardStateService.mouse_loc_cell, CellRegion.BOTTOM);
                    }
                }
            }

            if (this.boardStateService.doDiagonals) {
                if (loc.x > (this.boardStateService.cell_res / 2)) {
                    // right side
                    if (loc.y > (this.boardStateService.cell_res / 2)) {
                        // bottom
                        return new CellTarget(this.boardStateService.mouse_loc_cell, CellRegion.BKWD_EDGE);
                    } else {
                        // top
                        return new CellTarget(this.boardStateService.mouse_loc_cell, CellRegion.FWRD_EDGE);
                    }
                } else {
                    // left side
                    if (loc.y > (this.boardStateService.cell_res / 2)) {
                        // bottom
                        return new CellTarget(this.boardStateService.mouse_loc_cell, CellRegion.FWRD_EDGE);
                    } else {
                        // top
                        return new CellTarget(this.boardStateService.mouse_loc_cell, CellRegion.BKWD_EDGE);
                    }
                }
            }

            return new CellTarget(this.boardStateService.mouse_loc_cell, CellRegion.CENTER);

        }

        // LEFT/RIGHT
        if ((loc.x <= shift) && (loc.y > shift) && (loc.y < (this.boardStateService.cell_res - shift))) {
            return new CellTarget(this.boardStateService.mouse_loc_cell, CellRegion.LEFT_EDGE);
        }
        if ((loc.x >= (this.boardStateService.cell_res - shift)) && (loc.y > shift) && (loc.y < (this.boardStateService.cell_res - shift))) {
            return new CellTarget(new XyPair(this.boardStateService.mouse_loc_cell.x + 1, this.boardStateService.mouse_loc_cell.y), CellRegion.LEFT_EDGE);
        }

        // TOP/BOTTOM
        if ((loc.y <= shift) && (loc.x > shift) && (loc.x < (this.boardStateService.cell_res - shift))) {
            return new CellTarget(this.boardStateService.mouse_loc_cell, CellRegion.TOP_EDGE);
        }
        if ((loc.y >= (this.boardStateService.cell_res - shift)) && (loc.x > shift) && (loc.x < (this.boardStateService.cell_res - shift))) {
            return new CellTarget(new XyPair(this.boardStateService.mouse_loc_cell.x, this.boardStateService.mouse_loc_cell.y + 1), CellRegion.TOP_EDGE);
        }

        // CORNERS
        if ((loc.x <= shift) && (loc.y <= shift)) {
            return new CellTarget(this.boardStateService.mouse_loc_cell, CellRegion.CORNER);
        }
        if ((loc.x <= shift) && (loc.y >= (this.boardStateService.cell_res - shift))) {
            return new CellTarget(new XyPair(this.boardStateService.mouse_loc_cell.x, this.boardStateService.mouse_loc_cell.y + 1), CellRegion.CORNER);
        }
        if ((loc.x >= (this.boardStateService.cell_res - shift)) && (loc.y <= shift)) {
            return new CellTarget(new XyPair(this.boardStateService.mouse_loc_cell.x + 1, this.boardStateService.mouse_loc_cell.y), CellRegion.CORNER);
        }
        if ((loc.x >= (this.boardStateService.cell_res - shift)) && (loc.y >= (this.boardStateService.cell_res - shift))) {
            return new CellTarget(new XyPair(this.boardStateService.mouse_loc_cell.x + 1, this.boardStateService.mouse_loc_cell.y + 1), CellRegion.CORNER);
        }
    }

}
