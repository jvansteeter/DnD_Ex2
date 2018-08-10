import { CharacterSheetData } from './rule-set/character-sheet.data';

export interface CharacterData {
	_id: string;
	label: string;
	characterSheetId: string;
	characterSheet?: CharacterSheetData;
	values: any[];
}