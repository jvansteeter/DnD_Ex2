import {Injectable} from '@angular/core';
import {BoardStateService} from './board-state.service';
import {XyPair} from '../geometry/xy-pair';

@Injectable()
export class BoardNotationService {
    public notations: string[];

    private readonly xRes: number;
    private readonly yRes: number;

    private freeFormRed = 0;
    private freeFormGreen = 255;
    private freeFormBlue = 0;
    private freeFormAlpha = 255;

    public freeformNotation: Uint8ClampedArray;

    constructor(
        private boardStateService: BoardStateService
    ) {
        this.notations = [];
        this.xRes = this.boardStateService.mapDimX * BoardStateService.cell_res;
        this.yRes = this.boardStateService.mapDimY * BoardStateService.cell_res;
        this.freeformNotation = new Uint8ClampedArray(this.xRes * this.yRes);
        this.freeformNotation.fill(0);
    }

    public addNotation(name: string) {
        this.notations.push(name);
    }

    public setPixel(coor: XyPair) {
        console.log(coor);
        this.freeformNotation[this.xyToIndex(Math.floor(coor.x), Math.floor(coor.y))] = 1;
        this.freeformNotation[this.xyToIndex(Math.floor(coor.x) - 1, Math.floor(coor.y))] = 1;
        this.freeformNotation[this.xyToIndex(Math.floor(coor.x + 1), Math.floor(coor.y))] = 1;
        this.freeformNotation[this.xyToIndex(Math.floor(coor.x), Math.floor(coor.y) - 1)] = 1;
        this.freeformNotation[this.xyToIndex(Math.floor(coor.x), Math.floor(coor.y) + 1)] = 1;
        this.freeformNotation[this.xyToIndex(Math.floor(coor.x - 1), Math.floor(coor.y) - 1)] = 1;
        this.freeformNotation[this.xyToIndex(Math.floor(coor.x) - 1, Math.floor(coor.y) + 1)] = 1;
        this.freeformNotation[this.xyToIndex(Math.floor(coor.x) + 1, Math.floor(coor.y) - 1)] = 1;
        this.freeformNotation[this.xyToIndex(Math.floor(coor.x) + 1, Math.floor(coor.y) + 1)] = 1;
    }

    public genCanvasBitmap(ctx: CanvasRenderingContext2D): ImageData {
        const returnMe = ctx.createImageData(this.xRes,  this.yRes);
        let index = 0;
        for (const bit of this.freeformNotation) {
            if (bit === 1) {
                returnMe.data[index] = this.freeFormRed;
                returnMe.data[index + 1] = this.freeFormGreen;
                returnMe.data[index + 2] = this.freeFormBlue;
                returnMe.data[index + 3] = this.freeFormAlpha;
            } else {
                returnMe.data[index] = 0;
                returnMe.data[index + 1] = 0;
                returnMe.data[index + 2] = 0;
                returnMe.data[index + 3] = 0;
            }
            index = index + 4;
        }
        return returnMe;
    }

    private xyToIndex(x, y): number {
        return (y * this.xRes + x);
    }
}