import { CharacterData } from '../character.data';

export interface PlayerData {
	_id: string;
	encounterId: string;
	userId: string;
	activeTokenIndex: number;
	characterData: CharacterData;
	initiative: number;
	location: {x: number, y: number};
	isVisible: boolean;
	teams: string[];
}