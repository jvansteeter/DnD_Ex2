import {Line} from './line';
import {XyPair} from './xy-pair';
import {isNullOrUndefined} from 'util';

export class LineSeg {
  line: Line;

  point1_canvas: XyPair;
  point2_canvas: XyPair;

  constructor(origin_canvas: XyPair, target_canvas: XyPair) {
    this.point1_canvas = origin_canvas;
    this.point2_canvas = target_canvas;

    this.line = new Line(this.point2_canvas, this.point1_canvas);
  }

  doesIntersectWithSegment(lineSeg: LineSeg): boolean {
    const intersect = this.line.findIntersectWithLine(lineSeg.line);
    if (isNullOrUndefined(intersect)) {
      return false;
    }

    if ((Math.min(this.point1_canvas.x, this.point2_canvas.x) <= intersect.x) && (intersect.x <= Math.max(this.point1_canvas.x, this.point2_canvas.x))) {
      // intersect is within x bounds
      if ((Math.min(this.point1_canvas.y, this.point2_canvas.y) <= intersect.y) && (intersect.y <= Math.max(this.point1_canvas.y, this.point2_canvas.y))) {
        // intersect is within y bounds
        if ((Math.min(lineSeg.point1_canvas.x, lineSeg.point2_canvas.x) <= intersect.x) && (intersect.x <= Math.max(lineSeg.point1_canvas.x, lineSeg.point2_canvas.x))) {
          // intersect is within x bounds
          if ((Math.min(lineSeg.point1_canvas.y, lineSeg.point2_canvas.y) <= intersect.y) && (intersect.y <= Math.max(lineSeg.point1_canvas.y, lineSeg.point2_canvas.y))) {
            // intersect is within y bounds
            return true;
          }
        }
      }
    }
    return false;
  }
}
