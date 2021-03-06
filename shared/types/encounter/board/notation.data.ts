import { NotationVisibility } from './notation-visibility';
import { TextNotationData } from './text-notation.data';
import { XyPair } from './xy-pair';

export interface NotationData {
	_id: string;
	encounterId: string;
	userId: string;
	name: string;
	iconTag: string;

	freeformElements: XyPair[][];
	cellElements: XyPair[];
	textElements: TextNotationData[];

	isVisible: boolean;
	isLocked: boolean
	visibilityState: NotationVisibility;

	red: number;
	green: number;
	blue: number;
	alpha: number;
}
