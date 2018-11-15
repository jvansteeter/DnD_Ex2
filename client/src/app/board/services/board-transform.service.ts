import {Injectable} from '@angular/core';
import {XyPair} from '../../../../../shared/types/encounter/board/xy-pair';
import {BoardStateService} from './board-state.service';
import {BoardCanvasService} from './board-canvas.service';
import {CellTarget} from '../shared/cell-target';
import {CellRegion} from '../shared/enum/cell-region';
import {IsReadyService} from "../../utilities/services/isReady.service";

@Injectable()
export class BoardTransformService extends IsReadyService{
    constructor(
        private boardStateService: BoardStateService,
        private boardCanvasService: BoardCanvasService
    ) {
        super(boardStateService, boardCanvasService);
    }

    public init(): void {
        this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
            if (isReady && !this.isReady()) {
                console.log('boardTransformService.init() -> isReady');
                this.setReady(true);
            }
        })
    }

    public unInit() {
        console.log('boardTransformService.unInit()');
        this.setReady(false);
    }

    /*************************************************************************************************************************************
     * BoardTransformService
     **************************************************************************************************************************************
     * GENERAL NOTES
     *
     * --- When it comes toUserId locating things on the screen, there are a handful of coordinate systems
     *     toUserId be aware of. Variables and/or functions that require/return a specific value in a given
     *     coordinate scope will suffix the varible/function in an identifier for that scope
     *     --- '_screen': refers toUserId the pixel location on the screen, considered global
     *     --- '_canvas': refers toUserId the pixel location on the mapCanvas, relative toUserId its top corner
     *     --- '_map'   : refers toUserId the pixel location on the map, influenced by map transforms
     *     --- '_cell'  : refers toUserId a simple tile on the board-map. By taking the global 'squareSize' and
     *                    multiplying by the '_cell's X and Y values, one would get the '_canvas' value
     *                    for the cell
     *     --- 'cell_pix' : refers toUserId the pixel coordinate within the cell
     */

    /********************************************************************************************************************
     *  Coordinate space transforms
     ********************************************************************************************************************/
    screen_to_canvas(screenRes: XyPair): XyPair {
        const rect = this.boardCanvasService.mapContainerNativeElement.getBoundingClientRect();
        return new XyPair(screenRes.x - rect.left, screenRes.y - rect.top);
    }

    screen_to_map(screenRes: XyPair): XyPair {
        const canvasPixel = this.screen_to_canvas(screenRes);
        const mapX = (canvasPixel.x - this.boardStateService.canvasTransform_xOffset) / this.boardStateService.canvasTransform_scale;
        const mapY = (canvasPixel.y - this.boardStateService.canvasTransform_yOffset) / this.boardStateService.canvasTransform_scale;
        return new XyPair(mapX, mapY);
    }

    screen_to_cell(screenRes: XyPair): XyPair {
        const mapPixel = this.screen_to_map(screenRes);

        const cellX = Math.floor(mapPixel.x / BoardStateService.cell_res);
        const cellY = Math.floor(mapPixel.y / BoardStateService.cell_res);

        return new XyPair(cellX, cellY);
    }

    map_to_canvas(mapRes: XyPair): XyPair {
        const canvasX = (mapRes.x * this.boardStateService.canvasTransform_scale) + this.boardStateService.canvasTransform_xOffset;
        const canvasY = (mapRes.y * this.boardStateService.canvasTransform_scale) + this.boardStateService.canvasTransform_yOffset;
        return new XyPair(canvasX, canvasY);
    }

    map_to_screen(mapRes: XyPair): XyPair {
        const canvas = this.map_to_canvas(mapRes);
        const bound = this.boardCanvasService.mapContainerNativeElement.getBoundingClientRect();

        const screenX = canvas.x + bound.left;
        const screenY = canvas.y + bound.top;
        return new XyPair(screenX, screenY);
    }

    calculate_cell_target(loc: XyPair, input_offset = this.boardStateService.inputOffset, doDiagonals = this.boardStateService.doDiagonals): CellTarget {
        if (this.boardStateService.isEditingNotation) {
            input_offset = 0.0;
        }
        const shift = BoardStateService.cell_res * input_offset;

        // CENTER
        if ((loc.x > shift) && (loc.x < (BoardStateService.cell_res - shift) && (loc.y > shift) && (loc.y < (BoardStateService.cell_res - shift)))) {
            if (doDiagonals) {
                if (loc.x > (BoardStateService.cell_res / 2)) {
                    // right side
                    if (loc.y > (BoardStateService.cell_res / 2)) {
                        // bottom
                        return new CellTarget(this.boardStateService.mouse_loc_cell, CellRegion.BKWD_EDGE);
                    } else {
                        // top
                        return new CellTarget(this.boardStateService.mouse_loc_cell, CellRegion.FWRD_EDGE);
                    }
                } else {
                    // left side
                    if (loc.y > (BoardStateService.cell_res / 2)) {
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

        // LEFT_QUAD/RIGHT_QUAD
        if ((loc.x <= shift) && (loc.y > shift) && (loc.y < (BoardStateService.cell_res - shift))) {
            return new CellTarget(this.boardStateService.mouse_loc_cell, CellRegion.LEFT_EDGE);
        }
        if ((loc.x >= (BoardStateService.cell_res - shift)) && (loc.y > shift) && (loc.y < (BoardStateService.cell_res - shift))) {
            return new CellTarget(new XyPair(this.boardStateService.mouse_loc_cell.x + 1, this.boardStateService.mouse_loc_cell.y), CellRegion.LEFT_EDGE);
        }

        // TOP_QUAD/BOTTOM_QUAD
        if ((loc.y <= shift) && (loc.x > shift) && (loc.x < (BoardStateService.cell_res - shift))) {
            return new CellTarget(this.boardStateService.mouse_loc_cell, CellRegion.TOP_EDGE);
        }
        if ((loc.y >= (BoardStateService.cell_res - shift)) && (loc.x > shift) && (loc.x < (BoardStateService.cell_res - shift))) {
            return new CellTarget(new XyPair(this.boardStateService.mouse_loc_cell.x, this.boardStateService.mouse_loc_cell.y + 1), CellRegion.TOP_EDGE);
        }

        // CORNERS
        if ((loc.x <= shift) && (loc.y <= shift)) {
            return new CellTarget(this.boardStateService.mouse_loc_cell, CellRegion.CORNER);
        }
        if ((loc.x <= shift) && (loc.y >= (BoardStateService.cell_res - shift))) {
            return new CellTarget(new XyPair(this.boardStateService.mouse_loc_cell.x, this.boardStateService.mouse_loc_cell.y + 1), CellRegion.CORNER);
        }
        if ((loc.x >= (BoardStateService.cell_res - shift)) && (loc.y <= shift)) {
            return new CellTarget(new XyPair(this.boardStateService.mouse_loc_cell.x + 1, this.boardStateService.mouse_loc_cell.y), CellRegion.CORNER);
        }
        if ((loc.x >= (BoardStateService.cell_res - shift)) && (loc.y >= (BoardStateService.cell_res - shift))) {
            return new CellTarget(new XyPair(this.boardStateService.mouse_loc_cell.x + 1, this.boardStateService.mouse_loc_cell.y + 1), CellRegion.CORNER);
        }
    }

}
