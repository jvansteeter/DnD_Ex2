import { AspectType } from '../../client/src/app/types/character-sheet/aspect';

export interface AspectData {
	_id: string;
	characterSheetId: string;
	label: string;
	aspectType: AspectType;
	required: boolean;
	fontSize: number;
	config: {};
	items?: any[];
	ruleFunction?: string;
}
