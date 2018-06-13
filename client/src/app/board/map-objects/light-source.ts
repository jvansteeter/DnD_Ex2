import {XyPair} from '../geometry/xy-pair';
import {isNullOrUndefined} from 'util';
import {LightValue} from '../shared/light-value';

export class LightSource {
  public coor: XyPair;
  public full_range: number;
  public dim_range: number;

  constructor(x: number, y: number, full_range: number, dim_range?: number) {
    this.coor = new XyPair(x, y);
    if (isNullOrUndefined(dim_range)) {
      this.full_range = full_range;
      this.dim_range = full_range * 2;
    } else {
      this.dim_range = dim_range;
    }
  }

  lightImpactAtDistance(distance: number): LightValue {
    if (distance < this.full_range) {
      return LightValue.FULL;
    }
    if (distance < this.dim_range) {
      return LightValue.DIM;
    }
    return LightValue.DARK;
  }
}
