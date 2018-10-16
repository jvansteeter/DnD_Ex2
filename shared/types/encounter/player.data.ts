import { CharacterData } from '../character.data';

export interface PlayerData {
	_id: string;
	encounterId: string;
	characterData: CharacterData;
	initiative: number;
	location: {x: number, y: number};
	isVisible: boolean;
}