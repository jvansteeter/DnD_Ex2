import {XyPair} from '../geometry/xy-pair';
import {CellRegion} from './enum/cell-region';
import {Md5} from 'ts-md5/dist/md5';

export class CellTarget {
  public location: XyPair;
  public region: CellRegion;

  constructor(location: XyPair, zone: CellRegion) {
    this.location = location;
    this.region = zone;
  }

  toString(): string {
    return 'X' + this.location.x + '_Y' + this.location.y + '_' + this.region.toString();
  }

  hash(): string | null {
    const hashValue = Md5.hashStr(this.toString());
    if (typeof hashValue === 'string') {
      return hashValue;
    } else {
      return null;
    }
  }
}
