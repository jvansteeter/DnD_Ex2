import { CharacterSheetTooltipData } from './character-sheet-tooltip.data';

export interface CharacterSheetData {
	_id: string;
	ruleSetId: string;
	label: string;
	tooltipConfig: CharacterSheetTooltipData;
	aspects?: any[];
}