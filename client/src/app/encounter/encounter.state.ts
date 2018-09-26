import { LightValue } from '../board/shared/enum/light-value';
import { Player } from './player';
import { EncounterData } from '../../../../shared/types/encounter/encounter.data';
import { PlayerData } from '../../../../shared/types/encounter/player.data';
import { isUndefined } from 'util';
import { LightSourceData } from '../../../../shared/types/encounter/board/light-source.data';

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
	lightSources: LightSourceData[];
	mapDimX: number;
	mapDimY: number;
	map_enabled: boolean;
	playerWallsEnabled: boolean;
	playerIds: string[];
	isOpen: boolean;
	_players: PlayerData[];
	wallData: Object;
	mapUrl: string;

	private playerMap: Map<string, number>;

	constructor(encounterStateData: EncounterData) {
		for (let items in encounterStateData) {
			this[items] = encounterStateData[items];
		}
	}

	public getAspectValue(playerId: string, aspectLabel: string): any {
		const player: PlayerData = this._players[this.playerMap.get(playerId)];
		return player.characterData.values[aspectLabel];
	}

	public addPlayer(player: Player): void {
		if (!isUndefined(this.playerMap.get(player.id))) {
			return;
		}
		const index = this._players.length;
		this._players[index] = player;
		this.playerMap.set(player._id, index);
	}

	public removePlayer(player: Player): void {
		const index = this.playerMap.get(player.id);
		this._players.splice(index, 1);
		this.players = this._players;
	}

	get players(): PlayerData[] {
		return this._players;
	}

	set players(players: PlayerData[]) {
		this._players = [];
		this.playerMap = new Map<string, number>();
		for (let i = 0; i < players.length; i++) {
			let player = players[i];
			this._players[i] = new Player(player);
			this.playerMap.set(player._id, i);
		}
	}
}