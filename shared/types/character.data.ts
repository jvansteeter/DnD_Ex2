import { CharacterSheetData } from './rule-set/character-sheet.data';
import { TokenData } from './token.data';

export interface CharacterData {
	_id: string;
	label: string;
	creatorUserId: string;
	tokens: TokenData[];
	characterSheetId: string;
	characterSheet?: CharacterSheetData;
	ruleSetId?: string;
	campaignId?: string;
	values: {};
}