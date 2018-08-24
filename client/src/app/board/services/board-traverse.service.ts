import {Injectable} from '@angular/core';
import {CellTarget} from '../shared/cell-target';
import {XyPair} from '../geometry/xy-pair';
import {CellRegion} from '../shared/enum/cell-region';
import {BoardStateService} from "./board-state.service";
import {GeometryStatics} from "../statics/geometry-statics";
import {IsReadyService} from "../../utilities/services/isReady.service";

@Injectable()
export class BoardTraverseService extends IsReadyService {
    public blockingSegments: Set<string>;

    public numNodes: number;

    public dist = [];
    public canTraverse = [];            // canTraverse[fromIndex][toIndex] = 1|0 , true|false


    constructor(
        private boardStateService: BoardStateService
    ) {
        super(boardStateService);
        this.init();
    }

    public init(): void {
        this.dependenciesReady().subscribe((isReady: boolean) => {
            if (isReady) {
                this.blockingSegments = new Set();
                this.numNodes = this.boardStateService.mapDimX * this.boardStateService.mapDimY;

                this.initTraverseArray();
                this.initDistArray();
                this.setReady(true);
            }
        })
    }

    private initTraverseArray(): void {
        this.canTraverse = new Array(this.numNodes);
        for (let i = 0; i < this.numNodes; i++) {
            this.canTraverse[i] = new Array(this.numNodes);
            const adjIndexes = this.getAdjIndices(i);
            for (let index of adjIndexes) {
                if (this.canMoveIndexToIndex(i, index)) {
                    this.canTraverse[i][index] = 1;
                } else {
                    this.canTraverse[i][index] = 0;
                }
            }
        }
    }

    private initDistArray() {
        this.dist = new Array(this.numNodes);

        for (let i = 0; i < this.numNodes; i++) {
            this.dist[i] = new Array(this.numNodes);
            for (let j = 0; j < this.numNodes; j++) {
                if (i === j) {
                    this.dist[i][j] = 0;
                } else {
                    this.dist[i][j] = Infinity;
                }
            }
            const adjIndex = this.getAdjIndices(i);
            for (let index of adjIndex) {
                if (this.canMoveIndexToIndex(i, index)) {
                    this.dist[i][index] = 1;
                }
            }
        }
    }

    private getAdjIndices(index: number): Array<number> {
        const returnMe = [];
        const dimX = this.boardStateService.mapDimX;

        const onTop = index - dimX < 0;
        const onRight = (index % dimX) === (dimX - 1);
        const onBottom = index + dimX >= dimX * this.boardStateService.mapDimY;
        const onLeft = (index % dimX) === 0;

        if (!onTop) { returnMe.push(index - dimX); }
        if (!onRight) { returnMe.push(index + 1); }
        if (!onBottom) { returnMe.push(index + dimX); }
        if (!onLeft) { returnMe.push(index - 1); }

        if (!onLeft && !onTop) { returnMe.push(index - dimX - 1); }
        if (!onLeft && !onBottom) { returnMe.push(index + dimX - 1); }
        if (!onRight && !onTop) { returnMe.push(index - dimX + 1); }
        if (!onRight && !onBottom) { returnMe.push(index + dimX + 1); }

        return returnMe;
    }

    public blockNorth(cell: XyPair) {
        this.blockingSegments.add(new CellTarget(cell, CellRegion.TOP_EDGE).hash());
        this.initTraverseArray();
    }

    public unblockNorth(cell: XyPair) {
        this.blockingSegments.delete(new CellTarget(cell, CellRegion.TOP_EDGE).hash());
    }

    public blockWest(cell: XyPair) {
        this.blockingSegments.add(new CellTarget(cell, CellRegion.LEFT_EDGE).hash());
    }

    public unblockWest(cell: XyPair) {
        this.blockingSegments.delete(new CellTarget(cell, CellRegion.LEFT_EDGE).hash());
    }

    public blockFwd(cell: XyPair) {
        this.blockingSegments.add(new CellTarget(cell, CellRegion.FWRD_EDGE).hash());
    }

    public unblockFwd(cell: XyPair) {
        this.blockingSegments.delete(new CellTarget(cell, CellRegion.FWRD_EDGE).hash());
    }

    public blockBkw(cell: XyPair) {
        this.blockingSegments.add(new CellTarget(cell, CellRegion.BKWD_EDGE).hash());
    }

    public unblockBkw(cell: XyPair) {
        this.blockingSegments.delete(new CellTarget(cell, CellRegion.BKWD_EDGE).hash());
    }

    public calcTraversableCells(sourceCell: XyPair, range: number): Array<XyPair> {
        const returnMe = Array<XyPair>();

        const queue: { cell: XyPair, range: number, diagAsDouble: boolean }[] = [];
        const touched: Array<string> = [];

        queue.push({cell: sourceCell, range: range, diagAsDouble: false});
        touched.push(sourceCell.hash());

        while (queue.length > 0) {
            const curCell = queue.shift();

            if (curCell.range >= 0) {
                if (this.canMoveN(curCell.cell)) {
                    const northCell = new XyPair(curCell.cell.x, curCell.cell.y - 1);
                    if (touched.indexOf(northCell.hash()) === -1) {
                        queue.push({cell: northCell, range: curCell.range - 1, diagAsDouble: curCell.diagAsDouble});
                        touched.push(northCell.hash());
                    }
                }

                if (this.canMoveE(curCell.cell)) {
                    const eastCell = new XyPair(curCell.cell.x + 1, curCell.cell.y);
                    if (touched.indexOf(eastCell.hash()) === -1) {
                        queue.push({cell: eastCell, range: curCell.range - 1, diagAsDouble: curCell.diagAsDouble});
                        touched.push(eastCell.hash());
                    }
                }

                if (this.canMoveS(curCell.cell)) {
                    const southCell = new XyPair(curCell.cell.x, curCell.cell.y + 1);
                    if (touched.indexOf(southCell.hash()) === -1) {
                        queue.push({cell: southCell, range: curCell.range - 1, diagAsDouble: curCell.diagAsDouble});
                        touched.push(southCell.hash());
                    }
                }

                if (this.canMoveW(curCell.cell)) {
                    const westCell = new XyPair(curCell.cell.x - 1, curCell.cell.y);
                    if (touched.indexOf(westCell.hash()) === -1) {
                        queue.push({cell: westCell, range: curCell.range - 1, diagAsDouble: curCell.diagAsDouble});
                        touched.push(westCell.hash());
                    }
                }

                if (this.canMoveNE(curCell.cell)) {
                    const northEastCell = new XyPair(curCell.cell.x + 1, curCell.cell.y - 1);
                    if (touched.indexOf(northEastCell.hash()) === -1) {
                        let rangeDelta;
                        if (curCell.diagAsDouble) {
                            rangeDelta = -2;
                        } else {
                            rangeDelta = -1;
                        }
                        queue.push({
                            cell: northEastCell,
                            range: curCell.range + rangeDelta,
                            diagAsDouble: !curCell.diagAsDouble
                        });
                        touched.push(northEastCell.hash());
                    }
                }

                if (this.canMoveNW(curCell.cell)) {
                    const northWestCell = new XyPair(curCell.cell.x - 1, curCell.cell.y - 1);
                    if (touched.indexOf(northWestCell.hash()) === -1) {
                        let rangeDelta;
                        if (curCell.diagAsDouble) {
                            rangeDelta = -2;
                        } else {
                            rangeDelta = -1;
                        }
                        queue.push({
                            cell: northWestCell,
                            range: curCell.range + rangeDelta,
                            diagAsDouble: !curCell.diagAsDouble
                        });
                        touched.push(northWestCell.hash());
                    }
                }

                if (this.canMoveSE(curCell.cell)) {
                    const southEastCell = new XyPair(curCell.cell.x + 1, curCell.cell.y + 1);
                    if (touched.indexOf(southEastCell.hash()) === -1) {
                        let rangeDelta;
                        if (curCell.diagAsDouble) {
                            rangeDelta = -2;
                        } else {
                            rangeDelta = -1;
                        }
                        queue.push({
                            cell: southEastCell,
                            range: curCell.range + rangeDelta,
                            diagAsDouble: !curCell.diagAsDouble
                        });
                        touched.push(southEastCell.hash());
                    }
                }

                if (this.canMoveSW(curCell.cell)) {
                    const southWestCell = new XyPair(curCell.cell.x - 1, curCell.cell.y + 1);
                    if (touched.indexOf(southWestCell.hash()) === -1) {
                        let rangeDelta;
                        if (curCell.diagAsDouble) {
                            rangeDelta = -2;
                        } else {
                            rangeDelta = -1;
                        }
                        queue.push({
                            cell: southWestCell,
                            range: curCell.range + rangeDelta,
                            diagAsDouble: !curCell.diagAsDouble
                        });
                        touched.push(southWestCell.hash());
                    }
                }
                returnMe.push(curCell.cell);
            }
        }
        return returnMe;
    }

    private targetIsBlocked(target: CellTarget): boolean {
        return this.blockingSegments.has(target.hash());
    }

    private canMoveIndexToIndex(index1: number, index2: number): boolean {
        const dimX = this.boardStateService.mapDimX;
        if (index1 + 1 === index2) { return this.canMoveE(GeometryStatics.indexToXY(index1, dimX)); }
        if (index1 - 1 === index2) { return this.canMoveW(GeometryStatics.indexToXY(index1, dimX)); }
        if (index1 - dimX === index2) { return this.canMoveN(GeometryStatics.indexToXY(index1, dimX)); }
        if (index1 + dimX === index2) { return this.canMoveS(GeometryStatics.indexToXY(index1, dimX)); }
        if (index1 + 1 - dimX === index2) { return this.canMoveNE(GeometryStatics.indexToXY(index1, dimX)); }
        if (index1 + 1 + dimX === index2) { return this.canMoveSE(GeometryStatics.indexToXY(index1, dimX)); }
        if (index1 - 1 - dimX === index2) { return this.canMoveNW(GeometryStatics.indexToXY(index1, dimX)); }
        if (index1 -1 + dimX === index2) { return this.canMoveSW(GeometryStatics.indexToXY(index1, dimX)); }
        return false;
    }

    public canMoveN(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.TOP_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y - 1), CellRegion.FWRD_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y - 1), CellRegion.BKWD_EDGE))) {
            return false;
        }
        return true;
    }

    public canMoveNE(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y - 1), CellRegion.FWRD_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y - 1), CellRegion.BKWD_EDGE)) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y - 1), CellRegion.LEFT_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.TOP_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y - 1), CellRegion.LEFT_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.LEFT_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.TOP_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.TOP_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.TOP_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.LEFT_EDGE)))) {
            return false;
        }
        return true;
    }

    public canMoveE(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.LEFT_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.FWRD_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.BKWD_EDGE))) {
            return false;
        }
        return true;
    }

    public canMoveSE(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellRegion.FWRD_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellRegion.BKWD_EDGE)) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.LEFT_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.TOP_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.LEFT_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellRegion.LEFT_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.TOP_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellRegion.TOP_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellRegion.TOP_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellRegion.LEFT_EDGE)))) {
            return false;
        }
        return true;
    }

    public canMoveS(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.TOP_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.FWRD_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.BKWD_EDGE))) {
            return false;
        }
        return true;
    }

    public canMoveSW(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y + 1), CellRegion.FWRD_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y + 1), CellRegion.BKWD_EDGE)) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y + 1), CellRegion.TOP_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.LEFT_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.LEFT_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.TOP_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.LEFT_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.LEFT_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y + 1), CellRegion.TOP_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.TOP_EDGE)))) {
            return false;
        }
        return true;
    }

    public canMoveW(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.LEFT_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y), CellRegion.FWRD_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y), CellRegion.BKWD_EDGE))) {
            return false;
        }
        return true;
    }

    public canMoveNW(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y - 1), CellRegion.FWRD_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y - 1), CellRegion.BKWD_EDGE)) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.TOP_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y), CellRegion.TOP_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.LEFT_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y - 1), CellRegion.LEFT_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.LEFT_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.TOP_EDGE))) ||
            (this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y), CellRegion.TOP_EDGE)) && this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y - 1), CellRegion.LEFT_EDGE)))) {
            return false;
        }
        return true;
    }
}
