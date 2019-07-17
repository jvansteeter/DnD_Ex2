import { CharacterSheetTooltipData } from './character-sheet-tooltip.data';
import { AbilityData } from '../ability.data';
import { RuleData } from '../rule.data';

export interface CharacterSheetData {
	_id: string;
	ruleSetId: string;
	label: string;
	tooltipConfig: CharacterSheetTooltipData;
	rules?: RuleData[];
	aspects?: any[];
	abilities?: AbilityData[];
}