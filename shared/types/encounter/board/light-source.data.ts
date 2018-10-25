import { XyPair } from './xy-pair';

export interface LightSourceData {
	location: XyPair;
	bright_range: number;
	bright_polygon?: Array<XyPair>;
	dim_range: number;
	dim_polygon?: Array<XyPair>;
}