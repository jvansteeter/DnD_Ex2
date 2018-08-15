import { CharacterSheetData } from './rule-set/character-sheet.data';

export interface CharacterData {
	_id: string;
	label: string;
	creatorUserId: string;
	characterSheetId: string;
	characterSheet?: CharacterSheetData;
	ruleSetId?: string;
	campaignId?: string;
	values: {};
}