import {Injectable} from '@angular/core';
import {CellTarget} from '../shared/cell-target';
import {XyPair} from '../../../../../shared/types/encounter/board/xy-pair';
import {CellRegion} from '../shared/enum/cell-region';
import {BoardStateService} from "./board-state.service";
import {GeometryStatics} from "../statics/geometry-statics";
import {IsReadyService} from "../../utilities/services/isReady.service";
import {isDefined} from "@angular/compiler/src/util";
import { Subscription } from 'rxjs';

@Injectable()
export class BoardTraverseService extends IsReadyService {
    public blockingSegments: Set<string>;

    public numNodes: number;
    public traverseWeights = [];            // traverseWeights[fromIndex][toIndex] = 1|1.5|Infinity, adj|diag|not

		private dependenciesSub: Subscription;

    constructor(
        private boardStateService: BoardStateService
    ) {
        super(boardStateService);
    }

    public init(): void {
        console.log('boardTraverseService: init()');
        this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
            if (isReady) {
                this.blockingSegments = new Set();
                this.numNodes = this.boardStateService.mapDimX * this.boardStateService.mapDimY;
                this.initTraverseWeights();
                if (this.dependenciesSub) {
	                this.dependenciesSub.unsubscribe();
                }
                this.setReady(true);
            }
        })
    }

    public unInit(): void {
        console.log('boardTraverseService: unInit()');
        this.setReady(false);
        delete this.blockingSegments;
        delete this.numNodes;
        delete this.traverseWeights;
    }

    public initTraverseWeights(): void {
        this.traverseWeights = new Array(this.numNodes);

        // for each cell on the map ...
        for (let i = 0; i < this.numNodes; i++) {
            // ... create an array of 8 weights to represent the weight to each adj cell ...
            this.traverseWeights[i] = new Array(8);

            this.traverseWeights[i][0] = this.getTraverseWeightN(i);
            this.traverseWeights[i][1] = this.getTraverseWeightE(i);
            this.traverseWeights[i][2] = this.getTraverseWeightS(i);
            this.traverseWeights[i][3] = this.getTraverseWeightW(i);
            this.traverseWeights[i][4] = this.getTraverseWeightNW(i);
            this.traverseWeights[i][5] = this.getTraverseWeightNE(i);
            this.traverseWeights[i][6] = this.getTraverseWeightSE(i);
            this.traverseWeights[i][7] = this.getTraverseWeightSW(i);
        }
    }

    private getTraverseWeightN(index: number): number {
        const onTop = index - this.boardStateService.mapDimX < 0;
        if (!onTop && this.canMoveN(GeometryStatics.indexToXY(index, this.boardStateService.mapDimX))) {
            return 1;
        } else {
            return Infinity;
        }
    }

    private getTraverseWeightE(index: number): number {
        const onRight = (index % this.boardStateService.mapDimX) === (this.boardStateService.mapDimX - 1);
        if (!onRight && this.canMoveE(GeometryStatics.indexToXY(index, this.boardStateService.mapDimX))) {
            return 1;
        } else {
            return Infinity;
        }
    }

    private getTraverseWeightS(index: number): number {
        const onBottom = index + this.boardStateService.mapDimX >= this.boardStateService.mapDimX * this.boardStateService.mapDimY;
        if (!onBottom && this.canMoveS(GeometryStatics.indexToXY(index, this.boardStateService.mapDimX))) {
            return 1;
        } else {
            return Infinity;
        }
    }

    private getTraverseWeightW(index: number): number {
        const onLeft = (index % this.boardStateService.mapDimX) === 0;
        if (!onLeft && this.canMoveS(GeometryStatics.indexToXY(index, this.boardStateService.mapDimX))) {
            return 1;
        } else {
            return Infinity;
        }
    }

    private getTraverseWeightNW(index: number): number {
        const onTop = index - this.boardStateService.mapDimX < 0;
        const onLeft = (index % this.boardStateService.mapDimX) === 0;
        if (!onTop && !onLeft && this.canMoveNW(GeometryStatics.indexToXY(index, this.boardStateService.mapDimX))) {
            return 1.5;
        } else {
            return Infinity;
        }
    }

    private getTraverseWeightNE(index: number): number {
        const onTop = index - this.boardStateService.mapDimX < 0;
        const onRight = (index % this.boardStateService.mapDimX) === (this.boardStateService.mapDimX - 1);
        if (!onTop && !onRight && this.canMoveNE(GeometryStatics.indexToXY(index, this.boardStateService.mapDimX))) {
            return 1.5;
        } else {
            return Infinity;
        }
    }

    private getTraverseWeightSE(index: number): number {
        const onBottom = index + this.boardStateService.mapDimX >= this.boardStateService.mapDimX * this.boardStateService.mapDimY;
        const onRight = (index % this.boardStateService.mapDimX) === (this.boardStateService.mapDimX - 1);
        if (!onBottom && !onRight && this.canMoveSE(GeometryStatics.indexToXY(index, this.boardStateService.mapDimX))) {
            return 1.5;
        } else {
            return Infinity;
        }
    }

    private getTraverseWeightSW(index: number): number {
        const onBottom = index + this.boardStateService.mapDimX >= this.boardStateService.mapDimX * this.boardStateService.mapDimY;
        const onLeft = (index % this.boardStateService.mapDimX) === 0;
        if (!onBottom && !onLeft && this.canMoveSW(GeometryStatics.indexToXY(index, this.boardStateService.mapDimX))) {
            return 1.5;
        } else {
            return Infinity;
        }
    }


    private syncTraverseWeights(cellIndex: number) {
        // ... create an array of 8 weights to represent the weight to each adj cell ...
        this.traverseWeights[cellIndex] = new Array(8);

        this.traverseWeights[cellIndex][0] = this.getTraverseWeightN(cellIndex);
        this.traverseWeights[cellIndex][1] = this.getTraverseWeightE(cellIndex);
        this.traverseWeights[cellIndex][2] = this.getTraverseWeightS(cellIndex);
        this.traverseWeights[cellIndex][3] = this.getTraverseWeightW(cellIndex);
        this.traverseWeights[cellIndex][4] = this.getTraverseWeightNW(cellIndex);
        this.traverseWeights[cellIndex][5] = this.getTraverseWeightNE(cellIndex);
        this.traverseWeights[cellIndex][6] = this.getTraverseWeightSE(cellIndex);
        this.traverseWeights[cellIndex][7] = this.getTraverseWeightSW(cellIndex);
    }

    private getAdjIndices(index: number): number[] {
        const adj = new Array(8);
        const dimX = this.boardStateService.mapDimX;

        const onTop = index - dimX < 0;
        const onRight = (index % dimX) === (dimX - 1);
        const onBottom = index + dimX >= dimX * this.boardStateService.mapDimY;
        const onLeft = (index % dimX) === 0;

        if (!onTop) {
            adj[0] = (index - dimX);
        }
        if (!onRight) {
            adj[1] = (index + 1);
        }
        if (!onBottom) {
            adj[2] = (index + dimX);
        }
        if (!onLeft) {
            adj[3] = (index - 1);
        }

        if (!onLeft && !onTop) {
            adj[4] = (index - dimX - 1);
        }
        if (!onRight && !onTop) {
            adj[5] = (index - dimX + 1);
        }
        if (!onRight && !onBottom) {
            adj[6] = (index + dimX + 1);
        }
        if (!onLeft && !onBottom) {
            adj[7] = (index + dimX - 1);
        }

        return adj;
    }

    public blockNorth(cell: XyPair) {
        this.blockingSegments.add(new CellTarget(cell, CellRegion.TOP_EDGE).hash());
        const cellIndex = GeometryStatics.xyToIndex(cell.x, cell.y, this.boardStateService.mapDimX);
        const adjIndexes = this.getAdjIndices(cellIndex);
        for (let index of [cellIndex, ...adjIndexes]) {
            if (isDefined(index)) {
                this.syncTraverseWeights(index);
            }
        }
    }

    public unblockNorth(cell: XyPair) {
        this.blockingSegments.delete(new CellTarget(cell, CellRegion.TOP_EDGE).hash());
        const cellIndex = GeometryStatics.xyToIndex(cell.x, cell.y, this.boardStateService.mapDimX);
        const adjIndexes = this.getAdjIndices(cellIndex);
        for (let index of [cellIndex, ...adjIndexes]) {
            if (isDefined(index)) {
                this.syncTraverseWeights(index);
            }
        }
    }

    public blockWest(cell: XyPair) {
        this.blockingSegments.add(new CellTarget(cell, CellRegion.LEFT_EDGE).hash());
        const cellIndex = GeometryStatics.xyToIndex(cell.x, cell.y, this.boardStateService.mapDimX);
        const adjIndexes = this.getAdjIndices(cellIndex);
        for (let index of [cellIndex, ...adjIndexes]) {
            if (isDefined(index)) {
                this.syncTraverseWeights(index);
            }
        }
    }

    public unblockWest(cell: XyPair) {
        this.blockingSegments.delete(new CellTarget(cell, CellRegion.LEFT_EDGE).hash());
        const cellIndex = GeometryStatics.xyToIndex(cell.x, cell.y, this.boardStateService.mapDimX);
        const adjIndexes = this.getAdjIndices(cellIndex);
        for (let index of [cellIndex, ...adjIndexes]) {
            if (isDefined(index)) {
                this.syncTraverseWeights(index);
            }
        }
    }

    public blockFwd(cell: XyPair) {
        this.blockingSegments.add(new CellTarget(cell, CellRegion.FWRD_EDGE).hash());
        const cellIndex = GeometryStatics.xyToIndex(cell.x, cell.y, this.boardStateService.mapDimX);
        const adjIndexes = this.getAdjIndices(cellIndex);
        for (let index of [cellIndex, ...adjIndexes]) {
            if (isDefined(index)) {
                this.syncTraverseWeights(index);
            }
        }
    }

    public unblockFwd(cell: XyPair) {
        this.blockingSegments.delete(new CellTarget(cell, CellRegion.FWRD_EDGE).hash());
        const cellIndex = GeometryStatics.xyToIndex(cell.x, cell.y, this.boardStateService.mapDimX);
        const adjIndexes = this.getAdjIndices(cellIndex);
        for (let index of [cellIndex, ...adjIndexes]) {
            if (isDefined(index)) {
                this.syncTraverseWeights(index);
            }
        }
    }

    public blockBkw(cell: XyPair) {
        this.blockingSegments.add(new CellTarget(cell, CellRegion.BKWD_EDGE).hash());
        const cellIndex = GeometryStatics.xyToIndex(cell.x, cell.y, this.boardStateService.mapDimX);
        const adjIndexes = this.getAdjIndices(cellIndex);
        for (let index of [cellIndex, ...adjIndexes]) {
            if (isDefined(index)) {
                this.syncTraverseWeights(index);
            }
        }
    }

    public unblockBkw(cell: XyPair) {
        this.blockingSegments.delete(new CellTarget(cell, CellRegion.BKWD_EDGE).hash());
        const cellIndex = GeometryStatics.xyToIndex(cell.x, cell.y, this.boardStateService.mapDimX);
        const adjIndexes = this.getAdjIndices(cellIndex);
        for (let index of [cellIndex, ...adjIndexes]) {
            if (isDefined(index)) {
                this.syncTraverseWeights(index);
            }
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
            for (const v of [0, 1, 2, 3, 4, 5, 6, 7]) {
                const destIndex = adjIndexes[v];
                if (isDefined(destIndex)) {
                    const alt = distTo[u] + this.traverseWeights[u][v];
                    if (alt < distTo[destIndex]) {
                        distTo[destIndex] = alt;
                    }
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
