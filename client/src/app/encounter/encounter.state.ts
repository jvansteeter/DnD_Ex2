import { LightValue } from '../../../../shared/types/encounter/board/light-value';
import { Player } from './player';
import { EncounterData } from '../../../../shared/types/encounter/encounter.data';
import { PlayerData } from '../../../../shared/types/encounter/player.data';
import { isUndefined } from 'util';
import { LightSourceData } from '../../../../shared/types/encounter/board/light-source.data';
import { NotationData } from '../../../../shared/types/encounter/board/notation.data';
import { EncounterConfigData } from '../../../../shared/types/encounter/encounter-config.data';
import { EncounterConfigState } from './encounter-config.state';

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
	config: EncounterConfigData;
	configState: EncounterConfigState;
	_players: PlayerData[];
	wallData: Object;
	mapUrl: string;
	notations: NotationData[];

	private playerMap: Map<string, number>;

	constructor(encounterStateData: EncounterData) {
		for (let items in encounterStateData) {
			this[items] = encounterStateData[items];
		}
		this.configState = new EncounterConfigState();
		this.configState.setEncounterConfigData(encounterStateData.config);
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
