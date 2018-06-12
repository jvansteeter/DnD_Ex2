import {Injectable} from '@angular/core';
import {XyPair} from '../geometry/xy-pair';
import {BoardStateService} from './board-state.service';


@Injectable()
export class BoardService {
    constructor(
        public boardStateService: BoardStateService) {
    }

    static distanceCellToCell(cell1: XyPair, cell2: XyPair): number {
        const delta_y = Math.abs(cell2.y - cell1.y);
        const delta_x = Math.abs(cell2.x - cell1.x);
        const delta_delta = Math.abs(delta_y - delta_x);
        const small_delta = Math.min(delta_x, delta_y);
        const double_step = Math.floor(small_delta / 2);
        const reg_step = small_delta - double_step;
        return (2 * double_step) + reg_step + delta_delta;
    }

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
}
