import {Injectable} from '@angular/core';
import {CellTarget} from '../shared/cell-target';
import {XyPair} from '../../../../../shared/types/encounter/board/xy-pair';
import {CellRegion} from '../shared/enum/cell-region';
import {BoardStateService} from "./board-state.service";
import {GeometryStatics} from "../statics/geometry-statics";
import {IsReadyService} from "../../utilities/services/isReady.service";
import {isDefined} from "@angular/compiler/src/util";

@Injectable()
export class BoardTraverseService extends IsReadyService {
    public blockingSegments: Set<string>;

    public numNodes: number;
    public traverseWeights = [];

    constructor(
        private boardStateService: BoardStateService
    ) {
        super(boardStateService);
    }

    public init(): void {
        this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
            if (isReady && !this.isReady()) {
                console.log('boardTraverseService.init() -> isReady');
                this.blockingSegments = new Set();
                this.numNodes = this.boardStateService.mapDimX * this.boardStateService.mapDimY;
                this.initTraverseWeights();
                this.setReady(true);
            }
        })
    }

    public unInit(): void {
        console.log('boardTraverseService.unInit()');
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
        if (!onLeft && this.canMoveW(GeometryStatics.indexToXY(index, this.boardStateService.mapDimX))) {
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

    public targetIsBlocked(target: CellTarget): boolean {
        return this.blockingSegments.has(target.hash());
    }

    public canMoveN(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.TOP_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y - 1), CellRegion.FWRD_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y - 1), CellRegion.BKWD_EDGE))) {
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

    public canMoveS(loc: XyPair): boolean {
        if (this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.TOP_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.FWRD_EDGE)) ||
            this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.BKWD_EDGE))) {
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

    public canMoveNE(loc: XyPair): boolean {
        const NE_fwrd_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y - 1), CellRegion.FWRD_EDGE));
        const NE_bkwd_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y - 1), CellRegion.BKWD_EDGE));
        const N_bkwd_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y - 1), CellRegion.BKWD_EDGE));
        const E_bwkd_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.BKWD_EDGE));
        const top_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.TOP_EDGE));
        const E_top_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.TOP_EDGE));
        const E_left_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.LEFT_EDGE));
        const NE_left_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y - 1), CellRegion.LEFT_EDGE));

        if (NE_fwrd_isBlocked ||
            NE_bkwd_isBlocked ||
            (N_bkwd_isBlocked && E_bwkd_isBlocked) ||
            (top_isBlocked && E_bwkd_isBlocked) ||
            (E_top_isBlocked && N_bkwd_isBlocked) ||
            (N_bkwd_isBlocked && E_left_isBlocked) ||
            (E_bwkd_isBlocked && NE_left_isBlocked) ||
            (NE_left_isBlocked && E_top_isBlocked) ||
            (NE_left_isBlocked && E_left_isBlocked) ||
            (top_isBlocked && E_top_isBlocked) ||
            (top_isBlocked && E_left_isBlocked)) {
            return false;
        }
        return true;
    }

    public canMoveSE(loc: XyPair): boolean {
        const SE_fwrd_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellRegion.FWRD_EDGE));
        const SE_bkwd_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellRegion.BKWD_EDGE));
        const E_fwrd_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.FWRD_EDGE));
        const S_fwrd_is_Blocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.FWRD_EDGE));
        const S_top_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.TOP_EDGE));
        const E_left_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y), CellRegion.LEFT_EDGE));
        const SE_left_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellRegion.LEFT_EDGE));
        const SE_top_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x + 1, loc.y + 1), CellRegion.TOP_EDGE));

        if (SE_fwrd_isBlocked ||
            SE_bkwd_isBlocked ||
            (E_fwrd_isBlocked && S_fwrd_is_Blocked) ||
            (S_top_isBlocked && E_fwrd_isBlocked) ||
            (E_left_isBlocked && S_fwrd_is_Blocked) ||
            (E_fwrd_isBlocked && SE_left_isBlocked) ||
            (S_fwrd_is_Blocked && SE_top_isBlocked) ||
            (E_left_isBlocked && S_top_isBlocked) ||
            (E_left_isBlocked && SE_left_isBlocked) ||
            (S_top_isBlocked && SE_top_isBlocked) ||
            (SE_top_isBlocked && SE_left_isBlocked)) {
            return false;
        }
        return true;
    }

    public canMoveSW(loc: XyPair): boolean {
        const SW_fwrd_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y + 1), CellRegion.FWRD_EDGE));
        const SW_bkwd_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y + 1), CellRegion.BKWD_EDGE));
        const W_bkwd_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y), CellRegion.BKWD_EDGE));
        const S_bkwd_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.BKWD_EDGE));
        const S_top_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.TOP_EDGE));
        const S_left_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y + 1), CellRegion.LEFT_EDGE));
        const left_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.LEFT_EDGE));
        const SW_top_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y + 1), CellRegion.TOP_EDGE));

        if (SW_fwrd_isBlocked ||
            SW_bkwd_isBlocked ||
            (W_bkwd_isBlocked && S_bkwd_isBlocked) ||
            (W_bkwd_isBlocked && S_top_isBlocked) ||
            (W_bkwd_isBlocked && S_left_isBlocked) ||
            (left_isBlocked && S_bkwd_isBlocked) ||
            (SW_top_isBlocked && S_bkwd_isBlocked) ||
            (SW_top_isBlocked && S_left_isBlocked) ||
            (left_isBlocked && S_top_isBlocked) ||
            (left_isBlocked && S_left_isBlocked) ||
            (SW_top_isBlocked && S_top_isBlocked)) {
            return false;
        }
        return true;
    }

    public canMoveNW(loc: XyPair): boolean {
        const NW_fwrd_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y - 1), CellRegion.FWRD_EDGE));
        const NW_bkwd_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y - 1), CellRegion.BKWD_EDGE));
        const W_fwrd_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y), CellRegion.FWRD_EDGE));
        const N_fwrd_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y - 1), CellRegion.FWRD_EDGE));
        const N_left_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y - 1), CellRegion.LEFT_EDGE));
        const top_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.TOP_EDGE));
        const W_top_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x - 1, loc.y), CellRegion.TOP_EDGE));
        const left_isBlocked = this.targetIsBlocked(new CellTarget(new XyPair(loc.x, loc.y), CellRegion.LEFT_EDGE));

        if (NW_fwrd_isBlocked ||
            NW_bkwd_isBlocked ||
            (W_fwrd_isBlocked && N_fwrd_isBlocked) ||
            (W_fwrd_isBlocked && N_left_isBlocked) ||
            (W_fwrd_isBlocked && top_isBlocked) ||
            (W_top_isBlocked && N_fwrd_isBlocked) ||
            (left_isBlocked && N_fwrd_isBlocked) ||
            (top_isBlocked && W_top_isBlocked) ||
            (left_isBlocked && N_left_isBlocked) ||
            (left_isBlocked && top_isBlocked) ||
            (W_top_isBlocked && N_left_isBlocked)) {
            return false;
        }
        return true;
    }
}
