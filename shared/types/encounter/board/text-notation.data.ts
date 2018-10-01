import { XyPair } from './xy-pair';

export interface TextNotationData {
	_id: string;
	anchor: XyPair;
	text: string;
	fontSize: number;
}