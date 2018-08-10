import { AspectType } from '../../../client/src/app/types/character-sheet/aspect';
import { AspectConfig } from "../../../client/src/app/types/character-sheet/aspect-config";

export interface AspectData {
	_id: string;
	characterSheetId: string;
	label: string;
	aspectType: AspectType;
	required: boolean;
	isPredefined: boolean;
	fontSize: number;
	config: AspectConfig;
	items?: any[];
	ruleFunction?: string;
}
