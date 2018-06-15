import {LineSeg} from '../geometry/line-seg';
import {CellTarget} from '../shared/cell-target';
import {XyPair} from '../geometry/xy-pair';
import {CellRegion} from '../shared/cell-region';

export class Wall {
  public line_data: LineSeg;
  public loc: CellTarget;

  constructor(loc: CellTarget, square_size: number) {
    this.loc = loc;

    const top_left_pixel: XyPair = new XyPair(loc.coor.x * square_size, loc.coor.y * square_size);
    const bot_left_pixel: XyPair = new XyPair(loc.coor.x * square_size, (loc.coor.y * square_size) + square_size);
    const top_right_pixel: XyPair = new XyPair((loc.coor.x * square_size) + square_size, loc.coor.y * square_size);
    const bot_right_pixel: XyPair = new XyPair((loc.coor.x * square_size) + square_size, (loc.coor.y * square_size) + square_size);

    switch (loc.zone) {
      case CellRegion.TOP_EDGE :
        this.line_data = new LineSeg(top_left_pixel, top_right_pixel);
        break;
      case CellRegion.LEFT_EDGE :
        this.line_data = new LineSeg(top_left_pixel, bot_left_pixel);
        break;
      case CellRegion.FWRD_EDGE :
        this.line_data = new LineSeg(bot_left_pixel, top_right_pixel);
        break;
      case CellRegion.BKWD_EDGE :
        this.line_data = new LineSeg(top_left_pixel, bot_right_pixel);
        break;
    }
  }
}
