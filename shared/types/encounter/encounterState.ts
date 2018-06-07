import { Player } from './player';

export interface EncounterState {
	_id: string;
	label: string;
	date: Date;
	campaignId: string;
	gameMasters: string[];
  players: Player[];
}
