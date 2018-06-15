import {XyPair} from '../geometry/xy-pair';
import {isNullOrUndefined} from 'util';
import {LightValue} from '../shared/light-value';

export class LightSource {
    public location: XyPair;
    public full_range: number;
    public dim_range: number;

    constructor(location: XyPair, full_range: number, dim_range = full_range * 2) {
        this.location = location;
        this.full_range = full_range;
        this.dim_range = dim_range;
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
