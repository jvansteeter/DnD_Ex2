import {Injectable} from '@angular/core';
import {XyPair} from '../../../../../shared/types/encounter/board/geometry/xy-pair';
import {BoardStateService} from './board-state.service';
import {CellTarget} from '../shared/cell-target';
import {CellRegion} from '../shared/enum/cell-region';
import {isNullOrUndefined} from "util";
import {IsReadyService} from "../../utilities/services/isReady.service";
import {Polygon} from "../../../../../shared/types/encounter/board/polygon";
import {Line} from "../geometry/line";
import {Ray} from "../geometry/ray";
import {BoardCanvasService} from "./board-canvas.service";

@Injectable()
export class BoardVisibilityService extends IsReadyService {
    public blockingSegments: Set<string>;       // Set<CellTarget.hash()>
    private blockingBitmap = [];

    constructor(
        public boardStateService: BoardStateService,
        public boardCanvasService: BoardCanvasService,
    ) {
        super(boardStateService);
        this.init();
    }

    public init(): void {
        this.dependenciesReady().subscribe((isReady: boolean) => {
            if (isReady) {
                this.blockingSegments = new Set();
                this.blockingBitmap = [];

                for (let x = 0; x < this.boardStateService.mapDimX * BoardStateService.cell_res; x++) {
                    this.blockingBitmap[x] = [];
                    for (let y = 0; y < this.boardStateService.mapDimY * BoardStateService.cell_res; y++) {
                        this.blockingBitmap[x][y] = 0;
                    }
                }
                this.setReady(true);
            }
        })
    }

    public iKnowWhatImDoingGetTheBlockingBitMap(): any[] {
        return this.blockingBitmap;
    }

    public cellsVisibleFromCell(source: XyPair, range?: number) {
        const returnMe = new Array<XyPair>();
        let cellsToCheck = [];
        if (isNullOrUndefined(range)) {
            for (let x = 0; x < this.boardStateService.mapDimX; x += 1) {
                for (let y = 0; y < this.boardStateService.mapDimY; y += 1) {
                    cellsToCheck.push(new XyPair(x, y));
                }
            }
        } else {
            cellsToCheck = this.boardStateService.calcCellsWithinRangeOfCell(source, range);
        }

        for (let cell of cellsToCheck) {
            if (
                this.cellHasLOSTo_TopQuad(source, cell) ||
                this.cellHasLOSTo_RightQuad(source, cell) ||
                this.cellHasLOSTo_BottomQuad(source, cell) ||
                this.cellHasLOSTo_LeftQuad(source, cell)
            ) {
                returnMe.push(cell);
            }
        }

        return returnMe;
    }

    public raytraceVisibilityFromCell(source: XyPair, rayCount = 1000, ...additionalBlockingPoints: Array<XyPair>): Polygon {
        const degreeInc = 360 / rayCount;
        const poly = new Polygon();
        let additionalBlockingPointsArray;

        if (!isNullOrUndefined(additionalBlockingPoints)) {
            additionalBlockingPointsArray = [];
            for (let x = 0; x < this.boardStateService.mapDimX * BoardStateService.cell_res; x++) {
                additionalBlockingPointsArray[x] = [];
                for (let y = 0; y < this.boardStateService.mapDimY * BoardStateService.cell_res; y++) {
                    additionalBlockingPointsArray[x][y] = 0;
                }
            }
            for (let point of additionalBlockingPoints) {
                if (point.x < additionalBlockingPointsArray.length) {
                    if (point.y < additionalBlockingPointsArray[point.x].length) {
                        additionalBlockingPointsArray[point.x][point.y] = 1;
                    }
                }
            }
        }

        let degree;
        for (degree = 0; degree < 360; degree = degree + degreeInc) {
            const rayToCast = new Ray(source, degree);
            const boundPoint = this.getBoundIntercept(rayToCast);
            const boundPointFloor = new XyPair(Math.floor(boundPoint.x), Math.floor(boundPoint.y));
            const endPoint = this.rayCastToPoint(source, boundPointFloor, additionalBlockingPointsArray);
            poly.border.push(endPoint);
        }

        return poly;
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

        const topRightCell = new XyPair(cell.x + 1, cell.y - 1);
        if (this.targetIsBlocked(new CellTarget(topRightCell, CellRegion.LEFT_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.westSet(topRightCell));
        }
        if (this.targetIsBlocked(new CellTarget(topRightCell, CellRegion.FWRD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.fwdSet(topRightCell));
        }

        const rightCell = new XyPair(cell.x + 1, cell.y);
        if (this.targetIsBlocked(new CellTarget(rightCell, CellRegion.LEFT_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.westSet(rightCell));
        }
        if (this.targetIsBlocked(new CellTarget(rightCell, CellRegion.BKWD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.bkwSet(rightCell));
        }

        const botRightCell = new XyPair(cell.x + 1, cell.y + 1);
        if (this.targetIsBlocked(new CellTarget(botRightCell, CellRegion.TOP_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.northSet(botRightCell));
        }

        const botLeftCell = new XyPair(cell.x - 1, cell.y + 1);
        if (this.targetIsBlocked(new CellTarget(botLeftCell, CellRegion.TOP_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.northSet(botLeftCell));
        }

        const leftCell = new XyPair(cell.x - 1, cell.y);
        if (this.targetIsBlocked(new CellTarget(leftCell, CellRegion.FWRD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.fwdSet(leftCell));
        }
        if (this.targetIsBlocked(new CellTarget(leftCell, CellRegion.TOP_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.northSet(leftCell));
        }

        const topLeftCell = new XyPair(cell.x - 1, cell.y - 1);
        if (this.targetIsBlocked(new CellTarget(topLeftCell, CellRegion.BKWD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.bkwSet(topLeftCell));
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

        const topCell = new XyPair(cell.x, cell.y - 1);
        if (this.targetIsBlocked(new CellTarget(topCell, CellRegion.FWRD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.fwdSet(topCell));
        }

        const botCell = new XyPair(cell.x, cell.y + 1);
        if (this.targetIsBlocked(new CellTarget(botCell, CellRegion.TOP_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.northSet(botCell));
        }
        if (this.targetIsBlocked(new CellTarget(botCell, CellRegion.BKWD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.bkwSet(botCell));
        }

        const botLeftCell = new XyPair(cell.x - 1, cell.y + 1);
        if (this.targetIsBlocked(new CellTarget(botLeftCell, CellRegion.TOP_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.northSet(botLeftCell));
        }
        if (this.targetIsBlocked(new CellTarget(botLeftCell, CellRegion.FWRD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.fwdSet(botLeftCell));
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

        const topLeftCell = new XyPair(cell.x - 1, cell.y - 1);
        if (this.targetIsBlocked(new CellTarget(topLeftCell, CellRegion.BKWD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.bkwSet(topLeftCell));
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
        if (this.targetIsBlocked(new CellTarget(botCell, CellRegion.LEFT_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.westSet(botCell));
        }
        if (this.targetIsBlocked(new CellTarget(botCell, CellRegion.BKWD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.bkwSet(botCell));
        }

        const rightCell = new XyPair(cell.x + 1, cell.y);
        if (this.targetIsBlocked(new CellTarget(rightCell, CellRegion.LEFT_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.westSet(rightCell));
        }
        if (this.targetIsBlocked(new CellTarget(rightCell, CellRegion.TOP_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.northSet(rightCell));
        }
        if (this.targetIsBlocked(new CellTarget(rightCell, CellRegion.BKWD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.bkwSet(rightCell));
        }

        const leftCell = new XyPair(cell.x - 1, cell.y);
        if (this.targetIsBlocked(new CellTarget(leftCell, CellRegion.BKWD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.bkwSet(leftCell));
        }

        const topCell = new XyPair(cell.x, cell.y - 1);
        if (this.targetIsBlocked(new CellTarget(topCell, CellRegion.BKWD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.bkwSet(topCell));
        }

        const topRightCell = new XyPair(cell.x + 1, cell.y - 1);
        if (this.targetIsBlocked(new CellTarget(topRightCell, CellRegion.LEFT_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.westSet(topRightCell));
        }
        if (this.targetIsBlocked(new CellTarget(topRightCell, CellRegion.FWRD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.fwdSet(topRightCell));
        }

        const botLeftCell = new XyPair(cell.x - 1, cell.y + 1);
        if (this.targetIsBlocked(new CellTarget(botLeftCell, CellRegion.TOP_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.northSet(botLeftCell));
        }
        if (this.targetIsBlocked(new CellTarget(botLeftCell, CellRegion.FWRD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.fwdSet(botLeftCell));
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

        const topCell = new XyPair(cell.x, cell.y - 1);
        if (this.targetIsBlocked(new CellTarget(topCell, CellRegion.FWRD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.fwdSet(topCell));
        }
        if (this.targetIsBlocked(new CellTarget(topCell, CellRegion.LEFT_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.westSet(topCell));
        }

        const rightCell = new XyPair(cell.x + 1, cell.y);
        if (this.targetIsBlocked(new CellTarget(rightCell, CellRegion.LEFT_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.westSet(rightCell));
        }
        if (this.targetIsBlocked(new CellTarget(rightCell, CellRegion.FWRD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.fwdSet(rightCell));
        }

        const botRightCell = new XyPair(cell.x + 1, cell.y + 1);
        if (this.targetIsBlocked(new CellTarget(botRightCell, CellRegion.TOP_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.northSet(botRightCell));
        }
        if (this.targetIsBlocked(new CellTarget(botRightCell, CellRegion.LEFT_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.westSet(botRightCell));
        }
        if (this.targetIsBlocked(new CellTarget(botRightCell, CellRegion.BKWD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.bkwSet(botRightCell));
        }

        const botCell = new XyPair(cell.x, cell.y + 1);
        if (this.targetIsBlocked(new CellTarget(botCell, CellRegion.TOP_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.northSet(botCell));
        }
        if (this.targetIsBlocked(new CellTarget(botCell, CellRegion.FWRD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.fwdSet(botCell));
        }

        const leftCell = new XyPair(cell.x - 1, cell.y);
        if (this.targetIsBlocked(new CellTarget(leftCell, CellRegion.FWRD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.fwdSet(leftCell));
        }
        if (this.targetIsBlocked(new CellTarget(leftCell, CellRegion.TOP_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.northSet(leftCell));
        }

        const topLeftCell = new XyPair(cell.x - 1, cell.y - 1);
        if (this.targetIsBlocked(new CellTarget(topLeftCell, CellRegion.BKWD_EDGE))) {
            unsetPoints = BoardVisibilityService.setA_minus_setB(unsetPoints, this.bkwSet(topLeftCell));
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

    static BresenhamCircle(xc: number, yc: number, r: number): Array<XyPair> {
        const circlePoints = new Array<XyPair>();

        let x = 0;
        let y = r;
        let d = 3 - 2 * r;

        while (y >= x) {
            this.BresenhamDrawCircle(circlePoints, xc, yc, x, y);
            x++;

            if (d > 0) {
                y--;
                d = d + 4 * (x - y) + 10;
            } else {
                d = d + 4 * x + 6;
            }
            this.BresenhamDrawCircle(circlePoints, xc, yc, x, y);
        }

        return circlePoints;
    }

    static BresenhamDrawCircle(array: Array<XyPair>, xc: number, yc: number, x: number, y: number) {
        array.push(new XyPair(xc + x, yc + y));
        array.push(new XyPair(xc - x, yc + y));
        array.push(new XyPair(xc + x, yc - y));
        array.push(new XyPair(xc - x, yc - y));

        array.push(new XyPair(xc + y, yc + x));
        array.push(new XyPair(xc - y, yc + x));
        array.push(new XyPair(xc + y, yc - x));
        array.push(new XyPair(xc - y, yc - x));
    }

    static BresenhamLine(x0: number, y0: number, x1: number, y1: number): XyPair[] {
        const origin = new XyPair(x0, y0);
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
        if (result[0].x !== origin.x || result[0].y !== origin.y) {
            result.reverse();
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

    public rayCastToPoint(origin: XyPair, target: XyPair, additionalBlockingPoints?: Array<Array<number>>): XyPair {
        const points = BoardVisibilityService.BresenhamLine(origin.x, origin.y, target.x, target.y);
        for (const point of points) {
            if (!isNullOrUndefined(additionalBlockingPoints)) {
                if (this.blockingBitmap[point.x][point.y] === 1 || additionalBlockingPoints[point.x][point.y] === 1) {
                    return point;
                }
            } else {
                if (this.blockingBitmap[point.x][point.y] === 1) {
                    return point;
                }
            }
        }
        return target;
    }

    public getBoundIntercept(ray: Ray): XyPair {
        if (ray.direction_degrees >= 0 && ray.direction_degrees < 90) {
            const x_max_bound_intercept = ray.lineData.findIntersectWithLine(this.boardStateService.xBoundLine);

            if (x_max_bound_intercept === null) {return ray.lineData.findIntersectWithLine(this.boardStateService.yBoundLine);}
            if (x_max_bound_intercept.y < BoardStateService.cell_res * this.boardStateService.mapDimY) {return x_max_bound_intercept;}
            else {return ray.lineData.findIntersectWithLine(this.boardStateService.yBoundLine);}
        }

        if (ray.direction_degrees >= 90 && ray.direction_degrees < 180) {
            const x_zero_bound_intercept = ray.lineData.findIntersectWithLine(new Line(new XyPair(0,0), new XyPair(0,1)));

            if (x_zero_bound_intercept === null) {return ray.lineData.findIntersectWithLine(this.boardStateService.yBoundLine);}
            if (x_zero_bound_intercept.y < BoardStateService.cell_res * this.boardStateService.mapDimY  && !isNullOrUndefined(x_zero_bound_intercept)) {return x_zero_bound_intercept;}
            else {return ray.lineData.findIntersectWithLine(this.boardStateService.yBoundLine);}
        }

        if (ray.direction_degrees >= 180 && ray.direction_degrees < 270) {
            const x_zero_bound_intercept = ray.lineData.findIntersectWithLine(new Line(new XyPair(0,0), new XyPair(0,1)));

            if (x_zero_bound_intercept === null) {return ray.lineData.findIntersectWithLine(new Line(new XyPair(0,0), new XyPair(1,0)));}
            if (x_zero_bound_intercept.y > 0  && !isNullOrUndefined(x_zero_bound_intercept)) {return x_zero_bound_intercept;}
            else {return ray.lineData.findIntersectWithLine(new Line(new XyPair(0,0), new XyPair(1,0)));}
        }

        if (ray.direction_degrees >= 270 && ray.direction_degrees < 360) {
            const x_max_bound_intercept = ray.lineData.findIntersectWithLine(this.boardStateService.xBoundLine);

            if (x_max_bound_intercept === null) {return ray.lineData.findIntersectWithLine(new Line(new XyPair(0,0), new XyPair(1,0)));}
            if (x_max_bound_intercept.y > 0  && !isNullOrUndefined(x_max_bound_intercept)) {return x_max_bound_intercept;}
            else {return ray.lineData.findIntersectWithLine(new Line(new XyPair(0,0), new XyPair(1,0)));}
        }
    }

    genLOSNorthPoints(x_cell: number, y_cell: number): Array<XyPair> {
        const returnMe = Array<XyPair>();
        const _canvas = new XyPair(x_cell * BoardStateService.cell_res, y_cell * BoardStateService.cell_res);

        returnMe.push(new XyPair(Math.floor(_canvas.x + BoardStateService.cell_res * (1 / 3)), Math.floor(_canvas.y + BoardStateService.cell_res * (1 / 6))));
        returnMe.push(new XyPair(Math.floor(_canvas.x + BoardStateService.cell_res * (2 / 3)), Math.floor(_canvas.y + BoardStateService.cell_res * (1 / 6))));
        returnMe.push(new XyPair(Math.floor(_canvas.x + BoardStateService.cell_res * (1 / 2)), Math.floor(_canvas.y + BoardStateService.cell_res * (2 / 6))));

        return returnMe;
    }

    genLOSEastPoints(x_cell: number, y_cell: number): Array<XyPair> {
        const returnMe = Array<XyPair>();
        const _canvas = new XyPair(x_cell * BoardStateService.cell_res, y_cell * BoardStateService.cell_res);

        returnMe.push(new XyPair(Math.floor(_canvas.x + BoardStateService.cell_res * (5 / 6)), Math.floor(_canvas.y + BoardStateService.cell_res * (1 / 3))));
        returnMe.push(new XyPair(Math.floor(_canvas.x + BoardStateService.cell_res * (5 / 6)), Math.floor(_canvas.y + BoardStateService.cell_res * (2 / 3))));
        returnMe.push(new XyPair(Math.floor(_canvas.x + BoardStateService.cell_res * (4 / 6)), Math.floor(_canvas.y + BoardStateService.cell_res * (1 / 2))));

        return returnMe;
    }

    genLOSSouthPoints(x_cell: number, y_cell: number): Array<XyPair> {
        const returnMe = Array<XyPair>();
        const _canvas = new XyPair(x_cell * BoardStateService.cell_res, y_cell * BoardStateService.cell_res);

        returnMe.push(new XyPair(Math.floor(_canvas.x + BoardStateService.cell_res * (1 / 3)), Math.floor(_canvas.y + BoardStateService.cell_res * (5 / 6))));
        returnMe.push(new XyPair(Math.floor(_canvas.x + BoardStateService.cell_res * (2 / 3)), Math.floor(_canvas.y + BoardStateService.cell_res * (5 / 6))));
        returnMe.push(new XyPair(Math.floor(_canvas.x + BoardStateService.cell_res * (1 / 2)), Math.floor(_canvas.y + BoardStateService.cell_res * (4 / 6))));

        return returnMe;
    }

    genLOSWestPoints(x_cell: number, y_cell: number): Array<XyPair> {
        const returnMe = Array<XyPair>();
        const _canvas = new XyPair(x_cell * BoardStateService.cell_res, y_cell * BoardStateService.cell_res);

        returnMe.push(new XyPair(Math.floor(_canvas.x + BoardStateService.cell_res * (1 / 6)), Math.floor(_canvas.y + BoardStateService.cell_res * (1 / 3))));
        returnMe.push(new XyPair(Math.floor(_canvas.x + BoardStateService.cell_res * (1 / 6)), Math.floor(_canvas.y + BoardStateService.cell_res * (2 / 3))));
        returnMe.push(new XyPair(Math.floor(_canvas.x + BoardStateService.cell_res * (2 / 6)), Math.floor(_canvas.y + BoardStateService.cell_res * (1 / 2))));

        return returnMe;
    }

    cellHasLOSTo_TopQuad(origin_cell: XyPair, target_cell: XyPair): boolean {
        const origin_point = new XyPair(origin_cell.x * BoardStateService.cell_res + BoardStateService.cell_res / 2, origin_cell.y * BoardStateService.cell_res + BoardStateService.cell_res / 2);
        const target_points = this.genLOSNorthPoints(target_cell.x, target_cell.y);
        let traceCount = 0;
        for (const target_point of target_points) {
            if (this.rayCast(origin_point, target_point)) {
                traceCount++;
            }
        }
        return traceCount >= 3;
    }

    cellHasLOSTo_RightQuad(origin_cell: XyPair, target_cell: XyPair): boolean {
        const origin_point = new XyPair(origin_cell.x * BoardStateService.cell_res + BoardStateService.cell_res / 2, origin_cell.y * BoardStateService.cell_res + BoardStateService.cell_res / 2);
        const target_points = this.genLOSEastPoints(target_cell.x, target_cell.y);
        let traceCount = 0;
        for (const target_point of target_points) {
            if (this.rayCast(origin_point, target_point)) {
                traceCount++;
            }
        }
        return traceCount >= 3;
    }

    cellHasLOSTo_BottomQuad(origin_cell: XyPair, target_cell: XyPair): boolean {
        const origin_point = new XyPair(origin_cell.x * BoardStateService.cell_res + BoardStateService.cell_res / 2, origin_cell.y * BoardStateService.cell_res + BoardStateService.cell_res / 2);
        const target_points = this.genLOSSouthPoints(target_cell.x, target_cell.y);
        let traceCount = 0;
        for (const target_point of target_points) {
            if (this.rayCast(origin_point, target_point)) {
                traceCount++;
            }
        }
        return traceCount >= 3;
    }

    cellHasLOSTo_LeftQuad(origin_cell: XyPair, target_cell: XyPair): boolean {
        const origin_point = new XyPair(origin_cell.x * BoardStateService.cell_res + BoardStateService.cell_res / 2, origin_cell.y * BoardStateService.cell_res + BoardStateService.cell_res / 2);
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
        for (let y = cell.y * BoardStateService.cell_res; y >= (cell.y * BoardStateService.cell_res) - 1; y--) {
            for (let x = cell.x * BoardStateService.cell_res; x < cell.x * BoardStateService.cell_res + BoardStateService.cell_res; x++) {
                const pair = new XyPair(x, y);
                returnMe.set(pair.hash(), pair);
            }
        }
        return returnMe;
    }

    private westSet(cell: XyPair): Map<string, XyPair> {
        const returnMe = new Map<string, XyPair>();
        for (let x = cell.x * BoardStateService.cell_res; x >= (cell.x * BoardStateService.cell_res) - 1; x--) {
            for (let y = cell.y * BoardStateService.cell_res; y < cell.y * BoardStateService.cell_res + BoardStateService.cell_res; y++) {
                const pair = new XyPair(x, y);
                returnMe.set(pair.hash(), pair);
            }
        }
        return returnMe;
    }

    private fwdSet(cell: XyPair): Map<string, XyPair> {
        const returnMe = new Map<string, XyPair>();
        let y;
        let x;

        y = cell.y * BoardStateService.cell_res + BoardStateService.cell_res - 1;
        for (x = cell.x * BoardStateService.cell_res - 1; x < cell.x * BoardStateService.cell_res + BoardStateService.cell_res; x++) {
            const pair = new XyPair(x, y);
            returnMe.set(pair.hash(), pair);
            y--;
        }

        y = cell.y * BoardStateService.cell_res + BoardStateService.cell_res - 1;
        for (x = cell.x * BoardStateService.cell_res; x < cell.x * BoardStateService.cell_res + BoardStateService.cell_res; x++) {
            const pair = new XyPair(x, y);
            returnMe.set(pair.hash(), pair);
            y--;
        }

        y = cell.y * BoardStateService.cell_res + BoardStateService.cell_res;
        for (x = cell.x * BoardStateService.cell_res; x < cell.x * BoardStateService.cell_res + BoardStateService.cell_res + 1; x++) {
            const pair = new XyPair(x, y);
            returnMe.set(pair.hash(), pair);
            y--;
        }
        return returnMe;
    }

    private bkwSet(cell: XyPair): Map<string, XyPair> {
        const returnMe = new Map<string, XyPair>();

        let y;
        let x;

        y = cell.y * BoardStateService.cell_res;
        for (x = cell.x * BoardStateService.cell_res; x < cell.x * BoardStateService.cell_res + BoardStateService.cell_res; x++) {
            const pair = new XyPair(x, y);
            returnMe.set(pair.hash(), pair);
            y++;
        }

        y = cell.y * BoardStateService.cell_res - 1;
        for (x = cell.x * BoardStateService.cell_res; x < cell.x * BoardStateService.cell_res + BoardStateService.cell_res + 1; x++) {
            const pair = new XyPair(x, y);
            returnMe.set(pair.hash(), pair);
            y++;
        }

        y = cell.y * BoardStateService.cell_res;
        for (x = cell.x * BoardStateService.cell_res - 1; x < cell.x * BoardStateService.cell_res + BoardStateService.cell_res; x++) {
            const pair = new XyPair(x, y);
            returnMe.set(pair.hash(), pair);
            y++;
        }
        return returnMe;
    }
}
