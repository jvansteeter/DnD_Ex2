import {Injectable} from '@angular/core';
import {CellTarget} from '../shared/cell-target';
import {XyPair} from '../geometry/xy-pair';
import {CellRegion} from '../shared/enum/cell-region';
import {BoardStateService} from "./board-state.service";
import {GeometryStatics} from "../statics/geometry-statics";
import {IsReadyService} from "../../utilities/services/isReady.service";
import {range} from "rxjs/index";
import {ArrayStatics} from "../statics/array-statics";

@Injectable()
export class BoardTraverseService extends IsReadyService {
    public blockingSegments: Set<string>;

    public numNodes: number;
    public traverseWeights = [];            // traverseWeights[fromIndex][toIndex] = 1|1.5|Infinity, adj|diag|not

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

                this.initTraverseWeights();
                this.setReady(true);
            }
        })
    }

    public initTraverseWeights(): void {
        this.traverseWeights = new Array(this.numNodes);

        for (let i = 0; i < this.numNodes; i++) {
            this.traverseWeights[i] = new Array(this.numNodes);

            const adjIndexes = this.getAdjIndices(i);
            for (let index of adjIndexes.adj) {
                if (this.canMoveIndexToIndex(i, index)) {
                    this.traverseWeights[i][index] = 1;
                } else {
                    this.traverseWeights[i][index] = Infinity;
                }
            }
            for (let index of adjIndexes.diag) {
                if (this.canMoveIndexToIndex(i, index)) {
                    this.traverseWeights[i][index] = 1.5;
                } else {
                    this.traverseWeights[i][index] = Infinity;
                }
            }
        }
    }

    private syncTraverseWeights(cellIndex: number) {
        const adjIndexes = this.getAdjIndices(cellIndex);

        for (let adjIndex of adjIndexes.adj) {
            if (this.canMoveIndexToIndex(cellIndex, adjIndex)) {
                this.traverseWeights[cellIndex][adjIndex] = 1;
                this.traverseWeights[adjIndex][cellIndex] = 1;
            } else {
                this.traverseWeights[cellIndex][adjIndex] = Infinity;
                this.traverseWeights[adjIndex][cellIndex] = Infinity;
            }
        }
        for (let adjIndex of adjIndexes.diag) {
            if (this.canMoveIndexToIndex(cellIndex, adjIndex)) {
                this.traverseWeights[cellIndex][adjIndex] = 1.5;
                this.traverseWeights[adjIndex][cellIndex] = 1.5;
            } else {
                this.traverseWeights[cellIndex][adjIndex] = Infinity;
                this.traverseWeights[adjIndex][cellIndex] = Infinity;
            }
        }

        console.log(this.traverseWeights);
    }

    private getAdjIndices(index: number): { adj: Array<number>, diag: Array<number> } {
        const adj = [];
        const diag = [];
        const dimX = this.boardStateService.mapDimX;

        const onTop = index - dimX < 0;
        const onRight = (index % dimX) === (dimX - 1);
        const onBottom = index + dimX >= dimX * this.boardStateService.mapDimY;
        const onLeft = (index % dimX) === 0;

        if (!onTop) {
            adj.push(index - dimX);
        }
        if (!onRight) {
            adj.push(index + 1);
        }
        if (!onBottom) {
            adj.push(index + dimX);
        }
        if (!onLeft) {
            adj.push(index - 1);
        }

        if (!onLeft && !onTop) {
            diag.push(index - dimX - 1);
        }
        if (!onLeft && !onBottom) {
            diag.push(index + dimX - 1);
        }
        if (!onRight && !onTop) {
            diag.push(index - dimX + 1);
        }
        if (!onRight && !onBottom) {
            diag.push(index + dimX + 1);
        }

        return {adj: adj, diag: diag};
    }

    public blockNorth(cell: XyPair) {
        this.blockingSegments.add(new CellTarget(cell, CellRegion.TOP_EDGE).hash());
        const cellIndex = GeometryStatics.xyToIndex(cell.x, cell.y, this.boardStateService.mapDimX);
        const adjIndexes = this.getAdjIndices(cellIndex);
        for (let index of [cellIndex, ...adjIndexes.diag, ...adjIndexes.adj]) {
            this.syncTraverseWeights(index);
        }
    }

    public unblockNorth(cell: XyPair) {
        this.blockingSegments.delete(new CellTarget(cell, CellRegion.TOP_EDGE).hash());
        const cellIndex = GeometryStatics.xyToIndex(cell.x, cell.y, this.boardStateService.mapDimX);
        const adjIndexes = this.getAdjIndices(cellIndex);
        for (let index of [cellIndex, ...adjIndexes.diag, ...adjIndexes.adj]) {
            this.syncTraverseWeights(index);
        }
    }

    public blockWest(cell: XyPair) {
        this.blockingSegments.add(new CellTarget(cell, CellRegion.LEFT_EDGE).hash());
        const cellIndex = GeometryStatics.xyToIndex(cell.x, cell.y, this.boardStateService.mapDimX);
        const adjIndexes = this.getAdjIndices(cellIndex);
        for (let index of [cellIndex, ...adjIndexes.diag, ...adjIndexes.adj]) {
            this.syncTraverseWeights(index);
        }
    }

    public unblockWest(cell: XyPair) {
        this.blockingSegments.delete(new CellTarget(cell, CellRegion.LEFT_EDGE).hash());
        const cellIndex = GeometryStatics.xyToIndex(cell.x, cell.y, this.boardStateService.mapDimX);
        const adjIndexes = this.getAdjIndices(cellIndex);
        for (let index of [cellIndex, ...adjIndexes.diag, ...adjIndexes.adj]) {
            this.syncTraverseWeights(index);
        }
    }

    public blockFwd(cell: XyPair) {
        this.blockingSegments.add(new CellTarget(cell, CellRegion.FWRD_EDGE).hash());
        const cellIndex = GeometryStatics.xyToIndex(cell.x, cell.y, this.boardStateService.mapDimX);
        const adjIndexes = this.getAdjIndices(cellIndex);
        for (let index of [cellIndex, ...adjIndexes.diag, ...adjIndexes.adj]) {
            this.syncTraverseWeights(index);
        }
    }

    public unblockFwd(cell: XyPair) {
        this.blockingSegments.delete(new CellTarget(cell, CellRegion.FWRD_EDGE).hash());
        const cellIndex = GeometryStatics.xyToIndex(cell.x, cell.y, this.boardStateService.mapDimX);
        const adjIndexes = this.getAdjIndices(cellIndex);
        for (let index of [cellIndex, ...adjIndexes.diag, ...adjIndexes.adj]) {
            this.syncTraverseWeights(index);
        }
    }

    public blockBkw(cell: XyPair) {
        this.blockingSegments.add(new CellTarget(cell, CellRegion.BKWD_EDGE).hash());
        const cellIndex = GeometryStatics.xyToIndex(cell.x, cell.y, this.boardStateService.mapDimX);
        const adjIndexes = this.getAdjIndices(cellIndex);
        for (let index of [cellIndex, ...adjIndexes.diag, ...adjIndexes.adj]) {
            this.syncTraverseWeights(index);
        }
    }

    public unblockBkw(cell: XyPair) {
        this.blockingSegments.delete(new CellTarget(cell, CellRegion.BKWD_EDGE).hash());
        const cellIndex = GeometryStatics.xyToIndex(cell.x, cell.y, this.boardStateService.mapDimX);
        const adjIndexes = this.getAdjIndices(cellIndex);
        for (let index of [cellIndex, ...adjIndexes.diag, ...adjIndexes.adj]) {
            this.syncTraverseWeights(index);
        }
    }

    private indexesInRangeOfSource(index: number, range: number): Array<number> {
        // IMPROVE THIS METHOD NOT TO USE THE CONVERSION METHOD SO MUCH
        const cells = this.boardStateService.calcCellsWithinRangeOfCell(GeometryStatics.indexToXY(index, this.boardStateService.mapDimX), range);
        const returnMe = [];
        for (let cell of cells) {
            returnMe.push(GeometryStatics.xyToIndex(cell.x, cell.y, this.boardStateService.mapDimX));
        }
        return returnMe;
    }

    private dijkstraMinIndex(vertexIndexes: Array<number>, distArray: Array<number>): number {
        let minValue = distArray[vertexIndexes[0]];
        let minIndex = vertexIndexes[0];

        let index;
        for (index = 1; index < vertexIndexes.length; index++) {
            let currentDijkstraIndex = vertexIndexes[index];
            if (distArray[currentDijkstraIndex] < minValue) {
                minValue = distArray[currentDijkstraIndex];
                minIndex = currentDijkstraIndex;
            }
        }

        return minIndex;
    }

    public dijkstraTraverse(sourceCell: XyPair, range: number): Array<number> {
        const startIndex = GeometryStatics.xyToIndex(sourceCell.x, sourceCell.y, this.boardStateService.mapDimX);

        const distTo = new Array(this.numNodes);
        distTo.fill(Infinity, 0, distTo.length);

        const indexesOfImport = this.indexesInRangeOfSource(startIndex, range);

        const Q = [];

        for (let index of indexesOfImport) {
            distTo[index] = Infinity;
            Q.push(index);
        }

        distTo[startIndex] = 0;

        while (Q.length > 0) {
            let u = this.dijkstraMinIndex(Q, distTo);
            Q.splice(Q.indexOf(u), 1);

            const adjIndexes = this.getAdjIndices(u);
            for (const v of [...adjIndexes.diag, ...adjIndexes.adj]) {
                const alt = distTo[u] + this.traverseWeights[u][v];
                if (alt < distTo[v]) {
                    distTo[v] = alt;
                }
            }
        }

        let index;
        for (index = 0; index < distTo.length; index++) {
            distTo[index] = Math.trunc(distTo[index]);
        }
        return distTo;
    }

    private targetIsBlocked(target: CellTarget): boolean {
        return this.blockingSegments.has(target.hash());
    }

    private canMoveIndexToIndex(index1: number, index2: number): boolean {
        const dimX = this.boardStateService.mapDimX;
        const cellPair = GeometryStatics.indexToXY(index1, dimX);

        if (index1 + 1 === index2) {
            return this.canMoveE(cellPair);
        }
        if (index1 - 1 === index2) {
            return this.canMoveW(cellPair);
        }
        if (index1 - dimX === index2) {
            return this.canMoveN(cellPair);
        }
        if (index1 + dimX === index2) {
            return this.canMoveS(cellPair);
        }
        if (index1 + 1 - dimX === index2) {
            return this.canMoveNE(cellPair);
        }
        if (index1 + 1 + dimX === index2) {
            return this.canMoveSE(cellPair);
        }
        if (index1 - 1 - dimX === index2) {
            return this.canMoveNW(cellPair);
        }
        if (index1 - 1 + dimX === index2) {
            return this.canMoveSW(cellPair);
        }
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
