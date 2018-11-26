import { AspectType } from '../../../client/src/app/character-sheet/shared/aspect';
import { AspectConfig } from "../../../client/src/app/character-sheet/shared/aspect-config";
import { GridsterItem } from 'angular-gridster2';

export interface AspectData {
	_id: string;
	characterSheetId: string;
	label: string;
	aspectType: AspectType;
	required: boolean;
	isPredefined: boolean;
	fontSize: number;
	config: GridsterItem;
	items?: any[];
	ruleFunction?: string;
}
