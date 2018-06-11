import {Injectable} from '@angular/core';
import {XyPair} from '../geometry/xy-pair';
import {BoardStateService} from './board-state.service';
import {BoardWallService} from './board-wall.service';

@Injectable()
export class BoardLosService {
    constructor (
        public boardStateService: BoardStateService,
        public boardWallService: BoardWallService
    ){}

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
            if (this.losTrace(origin_point, target_point)) {
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
            if (this.losTrace(origin_point, target_point)) {
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
            if (this.losTrace(origin_point, target_point)) {
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
            if (this.losTrace(origin_point, target_point)) {
                traceCount++;
            }
        }
        return traceCount >= 3;
    }

    losTrace(origin_canvas: XyPair, target_canvas: XyPair): boolean {
        return this.boardWallService.rayCast(origin_canvas, target_canvas);
    }
}
