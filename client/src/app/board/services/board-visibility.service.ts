import {Injectable} from '@angular/core';
import {XyPair} from '../../../../../shared/types/encounter/board/xy-pair';
import {BoardStateService} from './board-state.service';
import {CellTarget} from '../shared/cell-target';
import {CellRegion} from '../shared/enum/cell-region';
import { isNullOrUndefined, isUndefined } from "util";
import {IsReadyService} from "../../utilities/services/isReady.service";
import {Line} from "../geometry/line";
import {Ray} from "../geometry/ray";
import {BoardCanvasService} from "./board-canvas.service";
import {BitArray} from "../shared/bit-array";
import {GeometryStatics} from "../statics/geometry-statics";
import {isDefined} from "@angular/compiler/src/util";

@Injectable()
export class BoardVisibilityService extends IsReadyService {
    public blockingSegments: Set<string>;       // Set<CellTarget.hash()>
    private blockingBitmap: BitArray;

    public canvas_rebuild_visibility_ctx: boolean = true;
    public canvas_vis: HTMLCanvasElement;
    public canvas_vis_context: CanvasRenderingContext2D;

    constructor(
        public boardStateService: BoardStateService,
        public boardCanvasService: BoardCanvasService,
    ) {
        super(boardStateService, boardCanvasService);
        this.init();
    }

    public init(): void {
        this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
            if (isReady && !this.isReady()) {
                console.log('boardVisibilityService.init() -> isReady');
                this.blockingSegments = new Set();
                this.blockingBitmap = new BitArray(BoardStateService.num_pixels);

                this.canvas_rebuild_visibility_ctx = true;
                this.canvas_vis = document.createElement('canvas');
                this.canvas_vis.height = BoardStateService.map_res_y;
                this.canvas_vis.width = BoardStateService.map_res_x;
                this.canvas_vis_context = this.canvas_vis.getContext('2d');

                this.setReady(true);
            }
        })
    }

    public unInit(): void {
        console.log('boardVisibilityService.unInit()');
        this.setReady(false);
        delete this.blockingBitmap;
        delete this.blockingSegments;
        delete this.canvas_vis;
        delete this.canvas_vis_context
    }

    public iKnowWhatImDoingGetTheBlockingBitMap(): BitArray {
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
            if (this.cellsVisibleFromCell(source, cell)) {
                returnMe.push(cell);
            }
        }

        return returnMe;
    }

    public cellHasLOSToCell(source: XyPair, target: XyPair): boolean {
        return this.cellHasLOSTo_TopQuad(source, target) || this.cellHasLOSTo_RightQuad(source, target) || this.cellHasLOSTo_BottomQuad(source, target) || this.cellHasLOSTo_LeftQuad(source, target);
    }

    public raytraceVisibilityFromCell(source: XyPair, rayCount, ...additionalBlockingPoints: Array<XyPair>): Array<XyPair> {
        const degreeInc = 360 / rayCount;
        const poly = new Array<XyPair>();
        let additionalBlockingPointsArray: BitArray;

        if (additionalBlockingPoints.length > 0) {
            additionalBlockingPointsArray = new BitArray(BoardStateService.num_pixels);
            for (let point of additionalBlockingPoints) {
                additionalBlockingPointsArray.set(GeometryStatics.xyToIndex(point.x, point.y, this.boardStateService.mapDimX * BoardStateService.cell_res));
            }
        }

        let degree;
        for (degree = 0; degree < 360; degree = degree + degreeInc) {
            const rayToCast = new Ray(source, degree);
            const boundPoint = this.getBoundIntercept(rayToCast);
            if (isNullOrUndefined(boundPoint)) {
            	continue;
            }
            const boundPointFloor = new XyPair(Math.floor(boundPoint.x), Math.floor(boundPoint.y));
            const endPoint = this.rayCastToPoint(source, boundPointFloor, additionalBlockingPointsArray);
            poly.push(endPoint);
        }

        return poly;
    }

    /*******************************************************************************************************************
     * Block/Unblock functions
     *******************************************************************************************************************/
    private targetIsBlocked(loc: CellTarget): boolean {
        return this.blockingSegments.has(loc.hash());
    }

    public blockCellTarget(cellTarget: CellTarget) {
        switch (cellTarget.region) {
            case CellRegion.TOP_EDGE:
                this.blockNorth(cellTarget.location);
                break;
            case CellRegion.LEFT_EDGE:
                this.blockWest(cellTarget.location);
                break;
            case CellRegion.FWRD_EDGE:
                this.blockFwd(cellTarget.location);
                break;
            case CellRegion.BKWD_EDGE:
                this.blockBkw(cellTarget.location);
                break;
        }
    }

    public unblockCellTarget(cellTarget: CellTarget) {
        switch (cellTarget.region) {
            case CellRegion.TOP_EDGE:
                this.unblockNorth(cellTarget.location);
                break;
            case CellRegion.LEFT_EDGE:
                this.unblockWest(cellTarget.location);
                break;
            case CellRegion.FWRD_EDGE:
                this.unblockFwd(cellTarget.location);
                break;
            case CellRegion.BKWD_EDGE:
                this.unblockBkw(cellTarget.location);
                break;
        }
    }

    public blockNorth(cell: XyPair) {
        this.blockingSegments.add((new CellTarget(cell, CellRegion.TOP_EDGE)).hash());
        for (const point of Array.from(this.northSet(cell).values())) {
            this.blockingBitmap.set(GeometryStatics.xyToIndex(point.x, point.y, this.boardStateService.mapDimX * BoardStateService.cell_res));
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
            this.blockingBitmap.unset(GeometryStatics.xyToIndex(point.x, point.y, this.boardStateService.mapDimX * BoardStateService.cell_res));
        }
    }

    public blockWest(cell: XyPair) {
        this.blockingSegments.add((new CellTarget(cell, CellRegion.LEFT_EDGE)).hash());
        for (const point of Array.from(this.westSet(cell).values())) {
            this.blockingBitmap.set(GeometryStatics.xyToIndex(point.x, point.y, this.boardStateService.mapDimX * BoardStateService.cell_res));
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
            this.blockingBitmap.unset(GeometryStatics.xyToIndex(point.x, point.y, this.boardStateService.mapDimX * BoardStateService.cell_res));
        }
    }

    public blockFwd(cell: XyPair) {
        this.blockingSegments.add((new CellTarget(cell, CellRegion.FWRD_EDGE)).hash());
        for (const point of Array.from(this.fwdSet(cell).values())) {
            this.blockingBitmap.set(GeometryStatics.xyToIndex(point.x, point.y, this.boardStateService.mapDimX * BoardStateService.cell_res));
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
            this.blockingBitmap.unset(GeometryStatics.xyToIndex(point.x, point.y, this.boardStateService.mapDimX * BoardStateService.cell_res));
        }

    }

    public blockBkw(cell: XyPair) {
        this.blockingSegments.add((new CellTarget(cell, CellRegion.BKWD_EDGE)).hash());
        for (const point of Array.from(this.bkwSet(cell).values())) {
            this.blockingBitmap.set(GeometryStatics.xyToIndex(point.x, point.y, this.boardStateService.mapDimX * BoardStateService.cell_res));
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
            this.blockingBitmap.unset(GeometryStatics.xyToIndex(point.x, point.y, this.boardStateService.mapDimX * BoardStateService.cell_res));
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

    public rayCast(origin: XyPair, target: XyPair): boolean {
        const points = GeometryStatics.BresenhamLine(origin.x, origin.y, target.x, target.y);
        for (const point of points) {
            if (this.blockingBitmap.get(GeometryStatics.xyToIndex(point.x, point.y, this.boardStateService.mapDimX * BoardStateService.cell_res))) {
                return false;
            }
        }
        return true;
    }

    public rayCastToPoint(origin: XyPair, target: XyPair, additionalBlockingPoints?: BitArray): XyPair {
    	  if (isUndefined(this.blockingBitmap)) {
    	  	return;
	      }
        const points = GeometryStatics.BresenhamLine(origin.x, origin.y, target.x, target.y);
        for (const point of points) {
            if (isDefined(additionalBlockingPoints)) {
                if (this.blockingBitmap.get(GeometryStatics.xyToIndex(point.x, point.y, this.boardStateService.mapDimX * BoardStateService.cell_res)) || additionalBlockingPoints.get(GeometryStatics.xyToIndex(point.x, point.y, this.boardStateService.mapDimX * BoardStateService.cell_res))) {
                    return point;
                }
            } else {
                if (this.blockingBitmap.get(GeometryStatics.xyToIndex(point.x, point.y, this.boardStateService.mapDimX * BoardStateService.cell_res))) {
                    return point;
                }
            }
        }
        return target;
    }

    public getBoundIntercept(ray: Ray): XyPair {
        if (ray.direction_degrees >= 0 && ray.direction_degrees < 90) {
            const x_max_bound_intercept = ray.lineData.findIntersectWithLine(this.boardStateService.xBoundLine);

            if (x_max_bound_intercept === null) {
                return ray.lineData.findIntersectWithLine(this.boardStateService.yBoundLine);
            }
            if (x_max_bound_intercept.y < BoardStateService.cell_res * this.boardStateService.mapDimY) {
                return x_max_bound_intercept;
            }
            else {
                return ray.lineData.findIntersectWithLine(this.boardStateService.yBoundLine);
            }
        }

        if (ray.direction_degrees >= 90 && ray.direction_degrees < 180) {
            const x_zero_bound_intercept = ray.lineData.findIntersectWithLine(new Line(new XyPair(0, 0), new XyPair(0, 1)));

            if (x_zero_bound_intercept === null) {
                return ray.lineData.findIntersectWithLine(this.boardStateService.yBoundLine);
            }
            if (x_zero_bound_intercept.y < BoardStateService.cell_res * this.boardStateService.mapDimY && !isNullOrUndefined(x_zero_bound_intercept)) {
                return x_zero_bound_intercept;
            }
            else {
                return ray.lineData.findIntersectWithLine(this.boardStateService.yBoundLine);
            }
        }

        if (ray.direction_degrees >= 180 && ray.direction_degrees < 270) {
            const x_zero_bound_intercept = ray.lineData.findIntersectWithLine(new Line(new XyPair(0, 0), new XyPair(0, 1)));

            if (x_zero_bound_intercept === null) {
                return ray.lineData.findIntersectWithLine(new Line(new XyPair(0, 0), new XyPair(1, 0)));
            }
            if (x_zero_bound_intercept.y > 0 && !isNullOrUndefined(x_zero_bound_intercept)) {
                return x_zero_bound_intercept;
            }
            else {
                return ray.lineData.findIntersectWithLine(new Line(new XyPair(0, 0), new XyPair(1, 0)));
            }
        }

        if (ray.direction_degrees >= 270 && ray.direction_degrees < 360) {
            const x_max_bound_intercept = ray.lineData.findIntersectWithLine(this.boardStateService.xBoundLine);

            if (x_max_bound_intercept === null) {
                return ray.lineData.findIntersectWithLine(new Line(new XyPair(0, 0), new XyPair(1, 0)));
            }
            if (x_max_bound_intercept.y > 0 && !isNullOrUndefined(x_max_bound_intercept)) {
                return x_max_bound_intercept;
            }
            else {
                return ray.lineData.findIntersectWithLine(new Line(new XyPair(0, 0), new XyPair(1, 0)));
            }
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
