import {XyPair} from '../../../../../shared/types/encounter/board/geometry/xy-pair';
import {isNullOrUndefined} from 'util';

export class Line {
  a: number;
  b: number;
  c: number;

  constructor(origin?: XyPair, target?: XyPair) {
    if (!isNullOrUndefined(origin) && !isNullOrUndefined(target)) {
      this.genLineFromPoints(target, origin);
    }
  }

  genLineFromPoints(point_1: XyPair, point_2: XyPair): void {
    this.a = point_2.y - point_1.y;
    this.b = point_1.x - point_2.x;
    this.c = (this.a * point_1.x) + (this.b * point_1.y);
  }

  findIntersectWithLine(line: Line): XyPair | null {
    const returnMe = new XyPair(0, 0);
    const det = (this.a * line.b) - (line.a * this.b);

    if (det === 0) {
      return null;
    } else {
      returnMe.x = (line.b * this.c - this.b * line.c) / det;
      returnMe.y = (this.a * line.c - line.a * this.c) / det;
      return returnMe;
    }
  }

  calcY(x: number): number {
    return ((this.c - this.a * x) / (this.b));
  }

  calcX(y: number): number {
    return ((this.c - this.b * y) / (this.a));
  }
}
