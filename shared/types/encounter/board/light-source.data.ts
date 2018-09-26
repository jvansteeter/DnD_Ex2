import { XyPair } from './geometry/xy-pair';
import { Polygon } from './polygon';

export interface LightSourceData {
	location: XyPair;
	bright_range: number;
	bright_polygon?: Polygon;
	dim_range: number;
	dim_polygon?: Polygon;
}