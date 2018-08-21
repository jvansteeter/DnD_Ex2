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

	private playerMap = new Map<string, number>();

	constructor(encounterStateData: EncounterData) {
		for (let items in encounterStateData) {
			this[items] = encounterStateData[items];
		}

		this.players = [];
		for (let i = 0; i < encounterStateData.players.length; i++) {
			let player = encounterStateData.players[i];
			this.players[i] = new Player(player);
			this.playerMap.set(player._id, i);
		}
	}

	public getAspectValue(playerId: string, aspectLabel: string): any {
		const player: PlayerData = this.players[this.playerMap.get(playerId)];
		return player.characterData.values[aspectLabel];
	}
}