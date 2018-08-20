import {XyPair} from "../geometry/xy-pair";

export class GeometryStatics {
    static distanceBetweenXyPairs(pair1: XyPair, pair2: XyPair): number {
        return Math.sqrt((pair2.x - pair1.x)**2 + (pair2.y - pair1.y)**2);
    }
}