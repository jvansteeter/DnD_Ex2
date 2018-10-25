import {XyPair} from '../../../../../shared/types/encounter/board/xy-pair';
import { LightSourceData } from '../../../../../shared/types/encounter/board/light-source.data';

export class LightSource implements LightSourceData {
    public location: XyPair;

    public bright_range: number;
    public bright_polygon: Array<XyPair>;

    public dim_range: number;
    public dim_polygon: Array<XyPair>;

    constructor(location: XyPair, bright_range: number, dim_range = bright_range * 2) {
        this.location = location;
        this.bright_range = bright_range;
        this.dim_range = dim_range;
    }

    get id(): string {
        return this.location.toString() + 'B' + this.bright_range + 'D' + this.dim_range;
    }
}
