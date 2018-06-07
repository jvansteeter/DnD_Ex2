import { Player } from './player';

export interface Encounter {
	_id: string;
	label: string;
	date: Date;
	campaignId: string;
	gameMasters: string[];
  players: Player[];
}
