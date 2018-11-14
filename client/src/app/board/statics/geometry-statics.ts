import {XyPair} from "../../../../../shared/types/encounter/board/xy-pair";
import {BoardStateService} from "../services/board-state.service";

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

    static BresenhamCircle(point: XyPair, r: number): Array<XyPair> {
        const circlePoints = new Array<XyPair>();
        let xc = point.x;
        let yc = point.y;

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

    static CellsUnderALine(start: XyPair, end: XyPair): Array<XyPair> {
        const line = GeometryStatics.BresenhamLine(start.x, start.y, end.x, end.y);
        const returnMe = [];
        const returnSet = new Set<string>();
        for (let point of line) {
            let cell = new XyPair(Math.trunc(point.x / BoardStateService.cell_res), Math.trunc(point.y / BoardStateService.cell_res));
            if (!returnSet.has(cell.toString())) {
                returnMe.push(cell);
                returnSet.add(cell.toString());
            }
        }
        return returnMe;
    }
}