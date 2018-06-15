import {Injectable} from '@angular/core';
import {XyPair} from '../geometry/xy-pair';
import {BoardStateService} from './board-state.service';
import {CellTarget} from '../shared/cell-target';
import {CellRegion} from '../shared/cell-region';

@Injectable()
export class BoardVisibilityService {
    public blockingSegments: Set<string>;       // Set<CellTarget.hash()>
    private blockingBitmap = [];

    constructor (
        public boardStateService: BoardStateService
    ) {
        this.blockingSegments = new Set();
        this.blockingBitmap = [];
        for (let x = 0; x < this.boardStateService.mapDimX * this.boardStateService.cell_res; x++) {
            this.blockingBitmap[x] = [];
            for (let y = 0; y < this.boardStateService.mapDimY * this.boardStateService.cell_res; y++) {
                this.blockingBitmap[x][y] = 0;
            }
        }
    }

    public cellsVisibleFromCell(source: XyPair): Array<XyPair> {
        const returnMe = [];

        for (let x = 0; x < this.boardStateService.mapDimX; x += 1) {
            for (let y = 0; y < this.boardStateService.mapDimY; y += 1) {
                const curCell = new XyPair(x, y);
                if (this.cellHasLOSToNorth(source, curCell)){
                    returnMe.push(curCell)
                }
            }
        }

        return returnMe;
    }

    /*******************************************************************************************************************
     * Block/Unblock functions
     *******************************************************************************************************************/
    private targetIsBlocked(loc: CellTarget): boolean {
        return this.blockingSegments.has(loc.hash());
    }

    public blockNorth(cell: XyPair) {
        this.blockingSegments.add((new CellTarget(cell, CellRegion.TOP_EDGE)).hash());
        for (const point of Array.from(this.northSet(cell).values())) {
            this.blockingBitmap[point.x][point.y] = 1;
        }
    }

    public unblockNorth(cell: XyPair) {
        this.blockingSegments.delete((new CellTarget(cell, CellRegion.TOP_EDGE)).hash());
        let unsetPoints = this.northSet(cell);
        if (this.targetIsBlocked(new CellTarget(cell, CellRegion.LEFT_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.westSet(cell));
        }
        if (this.targetIsBlocked(new CellTarget(cell, CellRegion.FWRD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.fwdSet(cell));
        }
        if (this.targetIsBlocked(new CellTarget(cell, CellRegion.BKWD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.bkwSet(cell));
        }

        const topCell = new XyPair(cell.x, cell.y - 1);
        if (this.targetIsBlocked(new CellTarget(topCell, CellRegion.LEFT_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.westSet(topCell));
        }
        if (this.targetIsBlocked(new CellTarget(topCell, CellRegion.FWRD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.fwdSet(topCell));
        }
        if (this.targetIsBlocked(new CellTarget(topCell, CellRegion.BKWD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.bkwSet(topCell));
        }

        const rightCell = new XyPair(cell.x + 1, cell.y);
        if (this.targetIsBlocked(new CellTarget(rightCell, CellRegion.LEFT_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.westSet(rightCell));
        }

        const topRightCell = new XyPair(cell.x + 1, cell.y - 1);
        if (this.targetIsBlocked(new CellTarget(topRightCell, CellRegion.LEFT_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.westSet(topRightCell));
        }

        for (const point of Array.from(unsetPoints.values())) {
            this.blockingBitmap[point.x][point.y] = 0;
        }
    }

    public blockWest(cell: XyPair) {
        this.blockingSegments.add((new CellTarget(cell, CellRegion.LEFT_EDGE)).hash());
        for (const point of Array.from(this.westSet(cell).values())) {
            this.blockingBitmap[point.x][point.y] = 1;
        }
    }

    public unblockWest(cell: XyPair) {
        this.blockingSegments.delete((new CellTarget(cell, CellRegion.LEFT_EDGE)).hash());
        let unsetPoints = this.westSet(cell);
        if (this.targetIsBlocked(new CellTarget(cell, CellRegion.TOP_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.northSet(cell));
        }
        if (this.targetIsBlocked(new CellTarget(cell, CellRegion.FWRD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.fwdSet(cell));
        }
        if (this.targetIsBlocked(new CellTarget(cell, CellRegion.BKWD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.bkwSet(cell));
        }

        const leftCell = new XyPair(cell.x - 1, cell.y);
        if (this.targetIsBlocked(new CellTarget(leftCell, CellRegion.TOP_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.northSet(leftCell));
        }
        if (this.targetIsBlocked(new CellTarget(leftCell, CellRegion.FWRD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.fwdSet(leftCell));
        }
        if (this.targetIsBlocked(new CellTarget(leftCell, CellRegion.BKWD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.bkwSet(leftCell));
        }

        const botCell = new XyPair(cell.x, cell.y + 1);
        if (this.targetIsBlocked(new CellTarget(botCell, CellRegion.TOP_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.northSet(botCell));
        }

        const botLeftCell = new XyPair(cell.x - 1, cell.y + 1);
        if (this.targetIsBlocked(new CellTarget(botLeftCell, CellRegion.TOP_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.northSet(botLeftCell));
        }

        for (const point of Array.from(unsetPoints.values())) {
            this.blockingBitmap[point.x][point.y] = 0;
        }
    }

    public blockFwd(cell: XyPair) {
        this.blockingSegments.add((new CellTarget(cell, CellRegion.FWRD_EDGE)).hash());
        for (const point of Array.from(this.fwdSet(cell).values())) {
            this.blockingBitmap[point.x][point.y] = 1;
        }
    }

    public unblockFwd(cell: XyPair) {
        this.blockingSegments.delete((new CellTarget(cell, CellRegion.FWRD_EDGE)).hash());
        let unsetPoints = this.fwdSet(cell);
        if (this.targetIsBlocked(new CellTarget(cell, CellRegion.LEFT_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.westSet(cell));
        }
        if (this.targetIsBlocked(new CellTarget(cell, CellRegion.TOP_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.northSet(cell));
        }
        if (this.targetIsBlocked(new CellTarget(cell, CellRegion.BKWD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.bkwSet(cell));
        }

        const botCell = new XyPair(cell.x, cell.y + 1);
        if (this.targetIsBlocked(new CellTarget(botCell, CellRegion.TOP_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.northSet(botCell));
        }

        const rightCell = new XyPair(cell.x + 1, cell.y);
        if (this.targetIsBlocked(new CellTarget(rightCell, CellRegion.LEFT_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.westSet(rightCell));
        }

        for (const point of Array.from(unsetPoints.values())) {
            this.blockingBitmap[point.x][point.y] = 0;
        }
    }

    public blockBkw(cell: XyPair) {
        this.blockingSegments.add((new CellTarget(cell, CellRegion.BKWD_EDGE)).hash());
        for (const point of Array.from(this.bkwSet(cell).values())) {
            this.blockingBitmap[point.x][point.y] = 1;
        }
    }

    public unblockBkw(cell: XyPair) {
        this.blockingSegments.delete((new CellTarget(cell, CellRegion.BKWD_EDGE)).hash());
        let unsetPoints = this.bkwSet(cell);
        if (this.targetIsBlocked(new CellTarget(cell, CellRegion.LEFT_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.westSet(cell));
        }
        if (this.targetIsBlocked(new CellTarget(cell, CellRegion.FWRD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.fwdSet(cell));
        }
        if (this.targetIsBlocked(new CellTarget(cell, CellRegion.TOP_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.northSet(cell));
        }

        const botCell = new XyPair(cell.x, cell.y + 1);
        if (this.targetIsBlocked(new CellTarget(botCell, CellRegion.TOP_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.northSet(botCell));
        }

        const rightCell = new XyPair(cell.x + 1, cell.y);
        if (this.targetIsBlocked(new CellTarget(rightCell, CellRegion.LEFT_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.westSet(rightCell));
        }

        for (const point of Array.from(unsetPoints.values())) {
            this.blockingBitmap[point.x][point.y] = 0;
        }
    }

    /*******************************************************************************************************************
     * LoS rayCasting functions
     *******************************************************************************************************************/

    private static setA_minus_setB(map_a: Map<string, XyPair>, map_b: Map<string, XyPair>): Map<string, XyPair> {
        const returnMe = new Map<string, XyPair>();
        for (const pair of Array.from(map_a.values())) {
            if (!map_b.has(pair.hash())) {
                returnMe.set(pair.hash(), pair);
            }
        }
        return returnMe;
    }

    private static BresenhamLine(x0: number, y0: number, x1: number, y1: number): XyPair[] {
        const result = Array<XyPair>();
        const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);

        let dummy: number;
        if (steep) {
            dummy = x0;
            x0 = y0;
            y0 = dummy;

            dummy = x1;
            x1 = y1;
            y1 = dummy;
        }
        if (x0 > x1) {
            dummy = x0;
            x0 = x1;
            x1 = dummy;
            dummy = y0;
            y0 = y1;
            y1 = dummy;
        }
        const deltaX = x1 - x0;
        const deltaY = Math.abs(y1 - y0);
        let error = 0;
        let y_step;
        let y = y0;
        if (y0 < y1) {
            y_step = 1;
        } else {
            y_step = -1;
        }
        for (let x = x0; x <= x1; x++) {
            if (steep) {
                result.push(new XyPair(y, x));
            } else {
                result.push(new XyPair(x, y));
            }
            error += deltaY;
            if (2 * error >= deltaX) {
                y += y_step;
                error -= deltaX;
            }
        }
        return result;
    }

    public rayCast(origin: XyPair, target: XyPair): boolean {
        const points = BoardVisibilityService.BresenhamLine(origin.x, origin.y, target.x, target.y);
        for (const point of points) {
            if (this.blockingBitmap[point.x][point.y] === 1) {
                return false;
            }
        }
        return true;
    }

    genLOSNorthPoints(x_cell: number, y_cell: number): Array<XyPair> {
        const returnMe = Array<XyPair>();
        const _canvas = new XyPair(x_cell * this.boardStateService.cell_res, y_cell * this.boardStateService.cell_res);

        returnMe.push(new XyPair(Math.floor(_canvas.x + this.boardStateService.cell_res * (1 / 3)), Math.floor(_canvas.y + this.boardStateService.cell_res * (1 / 6))));
        returnMe.push(new XyPair(Math.floor(_canvas.x + this.boardStateService.cell_res * (2 / 3)), Math.floor(_canvas.y + this.boardStateService.cell_res * (1 / 6))));
        returnMe.push(new XyPair(Math.floor(_canvas.x + this.boardStateService.cell_res * (1 / 2)), Math.floor(_canvas.y + this.boardStateService.cell_res * (2 / 6))));

        return returnMe;
    }

    genLOSEastPoints(x_cell: number, y_cell: number): Array<XyPair> {
        const returnMe = Array<XyPair>();
        const _canvas = new XyPair(x_cell * this.boardStateService.cell_res, y_cell * this.boardStateService.cell_res);

        returnMe.push(new XyPair(Math.floor(_canvas.x + this.boardStateService.cell_res * (5 / 6)), Math.floor(_canvas.y + this.boardStateService.cell_res * (1 / 3))));
        returnMe.push(new XyPair(Math.floor(_canvas.x + this.boardStateService.cell_res * (5 / 6)), Math.floor(_canvas.y + this.boardStateService.cell_res * (2 / 3))));
        returnMe.push(new XyPair(Math.floor(_canvas.x + this.boardStateService.cell_res * (4 / 6)), Math.floor(_canvas.y + this.boardStateService.cell_res * (1 / 2))));

        return returnMe;
    }

    genLOSSouthPoints(x_cell: number, y_cell: number): Array<XyPair> {
        const returnMe = Array<XyPair>();
        const _canvas = new XyPair(x_cell * this.boardStateService.cell_res, y_cell * this.boardStateService.cell_res);

        returnMe.push(new XyPair(Math.floor(_canvas.x + this.boardStateService.cell_res * (1 / 3)), Math.floor(_canvas.y + this.boardStateService.cell_res * (5 / 6))));
        returnMe.push(new XyPair(Math.floor(_canvas.x + this.boardStateService.cell_res * (2 / 3)), Math.floor(_canvas.y + this.boardStateService.cell_res * (5 / 6))));
        returnMe.push(new XyPair(Math.floor(_canvas.x + this.boardStateService.cell_res * (1 / 2)), Math.floor(_canvas.y + this.boardStateService.cell_res * (4 / 6))));

        return returnMe;
    }

    genLOSWestPoints(x_cell: number, y_cell: number): Array<XyPair> {
        const returnMe = Array<XyPair>();
        const _canvas = new XyPair(x_cell * this.boardStateService.cell_res, y_cell * this.boardStateService.cell_res);

        returnMe.push(new XyPair(Math.floor(_canvas.x + this.boardStateService.cell_res * (1 / 6)), Math.floor(_canvas.y + this.boardStateService.cell_res * (1 / 3))));
        returnMe.push(new XyPair(Math.floor(_canvas.x + this.boardStateService.cell_res * (1 / 6)), Math.floor(_canvas.y + this.boardStateService.cell_res * (2 / 3))));
        returnMe.push(new XyPair(Math.floor(_canvas.x + this.boardStateService.cell_res * (2 / 6)), Math.floor(_canvas.y + this.boardStateService.cell_res * (1 / 2))));

        return returnMe;
    }

    cellHasLOSToNorth(origin_cell: XyPair, target_cell: XyPair): boolean {
        const origin_point = new XyPair(origin_cell.x * this.boardStateService.cell_res + this.boardStateService.cell_res / 2, origin_cell.y * this.boardStateService.cell_res + this.boardStateService.cell_res / 2);
        const target_points = this.genLOSNorthPoints(target_cell.x, target_cell.y);
        let traceCount = 0;
        for (const target_point of target_points) {
            if (this.rayCast(origin_point, target_point)) {
                traceCount++;
            }
        }
        return traceCount >= 3;
    }

    cellHasLOSToEast(origin_cell: XyPair, target_cell: XyPair): boolean {
        const origin_point = new XyPair(origin_cell.x * this.boardStateService.cell_res + this.boardStateService.cell_res / 2, origin_cell.y * this.boardStateService.cell_res + this.boardStateService.cell_res / 2);
        const target_points = this.genLOSEastPoints(target_cell.x, target_cell.y);
        let traceCount = 0;
        for (const target_point of target_points) {
            if (this.rayCast(origin_point, target_point)) {
                traceCount++;
            }
        }
        return traceCount >= 3;
    }

    cellHasLOSToSouth(origin_cell: XyPair, target_cell: XyPair): boolean {
        const origin_point = new XyPair(origin_cell.x * this.boardStateService.cell_res + this.boardStateService.cell_res / 2, origin_cell.y * this.boardStateService.cell_res + this.boardStateService.cell_res / 2);
        const target_points = this.genLOSSouthPoints(target_cell.x, target_cell.y);
        let traceCount = 0;
        for (const target_point of target_points) {
            if (this.rayCast(origin_point, target_point)) {
                traceCount++;
            }
        }
        return traceCount >= 3;
    }

    cellHasLOSToWest(origin_cell: XyPair, target_cell: XyPair): boolean {
        const origin_point = new XyPair(origin_cell.x * this.boardStateService.cell_res + this.boardStateService.cell_res / 2, origin_cell.y * this.boardStateService.cell_res + this.boardStateService.cell_res / 2);
        const target_points = this.genLOSWestPoints(target_cell.x, target_cell.y);
        let traceCount = 0;
        for (const target_point of target_points) {
            if (this.rayCast(origin_point, target_point)) {
                traceCount++;
            }
        }
        return traceCount >= 3;
    }

    /*******************************************************************************************************************
     * BELOW ARE FUNCTIONS USED IN MANIPULATING THE BITMAP REPRESENTATION OF THE WALL DATA
     *******************************************************************************************************************/

    private northSet(cell: XyPair): Map<string, XyPair> {
        const returnMe = new Map<string, XyPair>();
        for (let y = cell.y * this.boardStateService.cell_res; y >= (cell.y * this.boardStateService.cell_res) - 1; y--) {
            for (let x = cell.x * this.boardStateService.cell_res; x < cell.x * this.boardStateService.cell_res + this.boardStateService.cell_res; x++) {
                const pair = new XyPair(x, y);
                returnMe.set(pair.hash(), pair);
            }
        }
        return returnMe;
    }

    private westSet(cell: XyPair): Map<string, XyPair> {
        const returnMe = new Map<string, XyPair>();
        for (let x = cell.x * this.boardStateService.cell_res; x >= (cell.x * this.boardStateService.cell_res) - 1; x--) {
            for (let y = cell.y * this.boardStateService.cell_res; y < cell.y * this.boardStateService.cell_res + this.boardStateService.cell_res; y++) {
                const pair = new XyPair(x, y);
                returnMe.set(pair.hash(), pair);
            }
        }
        return returnMe;
    }

    private fwdSet(cell: XyPair): Map<string, XyPair> {
        const returnMe = new Map<string, XyPair>();
        let y = cell.y * this.boardStateService.cell_res + this.boardStateService.cell_res - 1;
        for (let x = cell.x * this.boardStateService.cell_res; x < cell.x * this.boardStateService.cell_res + this.boardStateService.cell_res; x++) {
            const pair = new XyPair(x, y);
            returnMe.set(pair.hash(), pair);
            y--;
        }
        y = cell.y * this.boardStateService.cell_res + this.boardStateService.cell_res - 2;
        for (let x = cell.x * this.boardStateService.cell_res; x < cell.x * this.boardStateService.cell_res + this.boardStateService.cell_res - 1; x++) {
            const pair = new XyPair(x, y);
            returnMe.set(pair.hash(), pair);
            y--;
        }
        y = cell.y * this.boardStateService.cell_res + this.boardStateService.cell_res - 1;
        for (let x = cell.x * this.boardStateService.cell_res + 1; x < cell.x * this.boardStateService.cell_res + this.boardStateService.cell_res; x++) {
            const pair = new XyPair(x, y);
            returnMe.set(pair.hash(), pair);
            y--;
        }
        return returnMe;
    }

    private bkwSet(cell: XyPair): Map<string, XyPair> {
        const returnMe = new Map<string, XyPair>();
        let y = cell.y * this.boardStateService.cell_res;
        for (let x = cell.x * this.boardStateService.cell_res; x < cell.x * this.boardStateService.cell_res + this.boardStateService.cell_res; x++) {
            const pair = new XyPair(x, y);
            returnMe.set(pair.hash(), pair);
            y++;
        }
        y = cell.y * this.boardStateService.cell_res;
        for (let x = cell.x * this.boardStateService.cell_res + 1; x < cell.x * this.boardStateService.cell_res + this.boardStateService.cell_res; x++) {
            const pair = new XyPair(x, y);
            returnMe.set(pair.hash(), pair);
            y++;
        }
        y = cell.y * this.boardStateService.cell_res + 1;
        for (let x = cell.x * this.boardStateService.cell_res; x < cell.x * this.boardStateService.cell_res + this.boardStateService.cell_res - 1; x++) {
            const pair = new XyPair(x, y);
            returnMe.set(pair.hash(), pair);
            y++;
        }
        return returnMe;
    }
}
