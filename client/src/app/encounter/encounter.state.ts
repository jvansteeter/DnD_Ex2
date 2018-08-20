import { LightValue } from '../board/shared/enum/light-value';
import { Player } from './player';
import { EncounterData } from '../../../../shared/types/encounter/encounter.data';
import { PlayerData } from '../../../../shared/types/encounter/player.data';

export class EncounterState implements EncounterData {
	_id: string;
	version: number;
	ambientLight: LightValue;
	campaignId: string;
	cell_res: number;
	date: Date;
	gameMasters: string[];
	label: string;
	lightEnabled: boolean;
	lightSourceData: Object;
	mapDimX: number;
	mapDimY: number;
	map_enabled: boolean;
	playerWallsEnabled: boolean;
	playerIds: string[];
	players: PlayerData[];
	wallData: Object;

	constructor(encounterStateData: EncounterData) {
		for (let items in encounterStateData) {
			this[items] = encounterStateData[items];
		}

		this.players = [];
		for (let player of encounterStateData.players) {
			this.players.push(new Player(player));
		}
	}

}