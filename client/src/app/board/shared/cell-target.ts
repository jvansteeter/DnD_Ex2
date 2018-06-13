import {XyPair} from '../geometry/xy-pair';
import {CellZone} from './cell-zone';
import {Md5} from 'ts-md5/dist/md5';

export class CellTarget {
  public coor: XyPair;
  public zone: CellZone;

  constructor(location: XyPair, zone: CellZone) {
    this.coor = location;
    this.zone = zone;
  }

  toString(): string {
    return 'X' + this.coor.x + '_Y' + this.coor.y + '_' + this.zone.toString();
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
