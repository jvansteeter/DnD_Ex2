import {XyPair} from '../geometry/xy-pair';
import {isNullOrUndefined} from 'util';
import {LightValue} from '../shared/enum/light-value';
import {Polygon} from "../shared/polygon";

export class LightSource {
    public location: XyPair;

    public bright_range: number;
    public bright_polygon: Polygon;

    public dim_range: number;
    public dim_polygon: Polygon;

    constructor(location: XyPair, bright_range: number, dim_range = bright_range * 2) {
        this.location = location;
        this.bright_range = bright_range;
        this.dim_range = dim_range;
    }

    get id(): string {
        return this.location.toString() + 'B' + this.bright_range + 'D' + this.dim_range;
    }
}
