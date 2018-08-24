import {XyPair} from "../geometry/xy-pair";

export class GeometryStatics {
    static distanceBetweenXyPairs(pair1: XyPair, pair2: XyPair): number {
        return Math.sqrt((pair2.x - pair1.x)**2 + (pair2.y - pair1.y)**2);
    }

    static indexToXY (index: number, dimX: number): XyPair {
        return new XyPair(Math.trunc(index % dimX), Math.trunc(index / dimX));
    }

    static xyToIndex (x: number, y: number, dimX: number): number {
        return x + dimX * y;
    }
}