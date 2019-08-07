import { LightValue } from '../../../../shared/types/encounter/board/light-value';
import { Player } from './player';
import { EncounterData } from '../../../../shared/types/encounter/encounter.data';
import { PlayerData } from '../../../../shared/types/encounter/player.data';
import { isNullOrUndefined, isUndefined } from 'util';
import { LightSourceData } from '../../../../shared/types/encounter/board/light-source.data';
import { NotationData } from '../../../../shared/types/encounter/board/notation.data';
import { EncounterConfigData } from '../../../../shared/types/encounter/encounter-config.data';
import { EncounterConfigState } from './encounter-config.state';
import { Observable } from 'rxjs';
import { EncounterTeamsData } from '../../../../shared/types/encounter/encounter-teams.data';
import { EncounterTeamsState } from './encounter-teams.state';
import { TeamUser } from "../board/services/team-user";

export class EncounterState implements EncounterData {
	_id: string;
	version: number;
	ambientLight: LightValue;
	campaignId: string;
	cell_res: number;
	date: Date;
	gameMasters: string[];
	label: string;
	lightSources: LightSourceData[];
	mapDimX: number;
	mapDimY: number;
	map_enabled: boolean;
	playerWallsEnabled: boolean;
	playerIds: string[];
	isOpen: boolean;
	config: EncounterConfigData;
	configState: EncounterConfigState;
	round?: number;
	wallData: Object;
	doorData: Object;
	windowData: Object;
	mapUrl: string;
	notations: NotationData[];

	private _teamsData: EncounterTeamsData;
	private playerMap: Map<string, Player>;
	private teamsState: EncounterTeamsState;

	constructor(encounterStateData: EncounterData) {
		for (let items in encounterStateData) {
			this[items] = encounterStateData[items];
		}
		this.configState = new EncounterConfigState();
		this.configState.setEncounterConfigData(encounterStateData.config);
		this.teamsState = new EncounterTeamsState(encounterStateData.teamsData);
	}

	public getAspectValue(aspectLabel: string, playerId: string): any {
		const player: Player = this.playerMap.get(playerId);
		if (isNullOrUndefined(player)) {
			return null;
		}
		let value = player.getAspectValue(aspectLabel);
		if (isNullOrUndefined(value) || value === '') {
			return false;
		}
		return value;
	}

	public addPlayer(player: Player): void {
		if (!isUndefined(this.playerMap.get(player.id))) {
			return;
		}
		this.playerMap.set(player._id, player);
	}

	public removePlayer(player: Player): void {
		this.playerMap.delete(player.id);
	}

	get players(): PlayerData[] {
		return [...this.playerMap.values()];
	}

	set players(players: PlayerData[]) {
		this.playerMap = new Map<string, Player>();
		for (let player of players) {
			this.playerMap.set(player._id, new Player(player));
		}
	}

	public addTeam(team: string): void {
		for (let existingTeam of this.teamsState.teams) {
			if (team === existingTeam) {
				return;
			}
		}
		this.teamsState.addTeam(team);
	}

	public removeTeam(team: string): void {
		this.teamsState.removeTeam(team);
	}

	public toggleUserTeam(userId: string, team: string): void {
		this.teamsState.toggleUserTeam(userId, team);
	}

	get teamsChangeObservable(): Observable<void> {
		return this.teamsState.changeObservable;
	}

	get teamsData(): EncounterTeamsData {
		return this.teamsState.serialized();
	}

	set teamsData(value) {
		if (this.teamsState) {
			this.teamsState.setEncounterTeamsData(value);
		}
	}

	get users(): TeamUser[] {
		if (this.teamsState) {
			return this.teamsState.users;
		}

		return [];
	}

	public getTeamUser(userId: string): TeamUser {
		return this.teamsState.getUser(userId);
	}
}
