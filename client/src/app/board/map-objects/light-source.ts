import {XyPair} from '../geometry/xy-pair';
import {isNullOrUndefined} from 'util';
import {LightValue} from '../shared/enum/light-value';

export class LightSource {
    public location: XyPair;
    public bright_range: number;
    public dim_range: number;

    constructor(location: XyPair, bright_range: number, dim_range = bright_range * 2) {
        this.location = location;
        this.bright_range = bright_range;
        this.dim_range = dim_range;
    }

    // lightImpactAtDistance(distance: number): LightValue {
    //     if (distance < this.bright_range) {
    //         return LightValue.FULL;
    //     }
    //     if (distance < this.dim_range) {
    //         return LightValue.DIM;
    //     }
    //     return LightValue.DARK;
    // }
}
