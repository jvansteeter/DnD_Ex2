import { EncounterStateData } from '../../../../shared/types/encounter/encounterState';
import { LightValue } from '../board/shared/enum/light-value';
import { PlayerData } from '../../../../shared/types/encounter/player';
import { Player } from './player';

export class EncounterState implements EncounterStateData {
	_id: string;
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
	players: PlayerData[];
	wallData: Object;

	constructor(encounterStateData: EncounterStateData) {
		for (let items in encounterStateData) {
			this[items] = encounterStateData[items];
		}

		this.players = [];
		for (let player of encounterStateData.players) {
			this.players.push(new Player(player.name, player.hp, player.maxHp, 10, player.location.x, player.location.y, player.tokenUrl));
		}
	}

}