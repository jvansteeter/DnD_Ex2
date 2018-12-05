import { Injectable } from '@angular/core';
import { IsReadyService } from '../utilities/services/isReady.service';
import { EncounterRepository } from '../repositories/encounter.repository';
import { Player } from './player';
import { Observable } from "rxjs";
import { EncounterState } from './encounter.state';
import { EncounterData } from '../../../../shared/types/encounter/encounter.data';
import { CharacterData } from '../../../../shared/types/character.data';
import { NotationData } from '../../../../shared/types/encounter/board/notation.data';
import { EncounterConfigData } from '../../../../shared/types/encounter/encounter-config.data';
import { LightValue } from '../../../../shared/types/encounter/board/light-value';
import { PlayerVisibilityMode } from '../../../../shared/types/encounter/board/player-visibility-mode';
import { EncounterTeamsData } from '../../../../shared/types/encounter/encounter-teams.data';
import { LightSourceData } from '../../../../shared/types/encounter/board/light-source.data';
import { TeamUser } from "../board/services/team-user";

@Injectable()
export class EncounterService extends IsReadyService {
	protected claimedPlayerId: string;
	protected hasClaimedPlayer = false;

	public encounterId: string;
	private encounterState: EncounterState;

	constructor(
			protected encounterRepo: EncounterRepository,
	) {
		super();
	}

	public init(): void {
		this.encounterRepo.getEncounter(this.encounterId).subscribe((encounter: EncounterData) => {
			this.encounterState = new EncounterState(encounter);
			this.setReady(true);
		});
	}

	public setEncounterId(id: string): void {
		this.encounterId = id;
		this.setReady(false);
		this.init();
	}

	public addPlayer(player: Player): void {
		this.encounterState.addPlayer(player);
	}

	public removePlayer(player: Player): void {
		this.encounterState.removePlayer(player);
	}

	public addCharacters(characters: CharacterData[]): Observable<void> {
		return this.encounterRepo.addCharacters(this.encounterId, characters);
	}

	public getPlayerById(id: string): Player {
		for (const player of this.players) {
			if (player.id === id) {
				return player;
			}
		}
	}

	public addTeam(teamName: string): void {
		this.encounterState.addTeam(teamName);
	}

	public removeTeam(team: string): void {
		this.encounterState.removeTeam(team);
	}

	public toggleUserTeam(userId: string, team: string): void {
		this.encounterState.toggleUserTeam(userId, team);
	}

	get players(): Player[] {
		if (this.encounterState) {
			return this.encounterState.players as Player[];
		}
		return [];
	}

	public getAspectValue(playerId: string, aspectLabel: string): any {
		return this.encounterState.getAspectValue(playerId, aspectLabel);
	}

	public getTeamUser(userId: string): TeamUser {
		return this.encounterState.getTeamUser(userId);
	}

	public getExportJson(): Observable<any> {
		return this.encounterRepo.getEncounterExportJson(this.encounterId);
	}

	get mapUrl(): string {
		if (this.encounterState) {
			return this.encounterState.mapUrl;
		}

		return '';
	}

	get mapDimX(): number {
		if (this.encounterState) {
			return this.encounterState.mapDimX;
		}

		return 1;
	}

	get mapDimY(): number {
		if (this.encounterState) {
			return this.encounterState.mapDimY;
		}

		return 1;
	}

	get version(): number {
		if (this.encounterState) {
			return this.encounterState.version;
		}

		return undefined;
	}

	set version(value: number) {
		if (this.encounterState) {
			this.encounterState.version = value;
		}
	}

	get notations(): NotationData[] {
		if (this.encounterState) {
			return this.encounterState.notations;
		}

		return undefined;
	}

	get wallData(): Object {
		if (this.encounterState) {
			return this.encounterState.wallData;
		}

		return undefined;
	}

	get doorData(): Object {
		if (this.encounterState) {
			return this.encounterState.doorData;
		}

		return undefined;
	}

    get windowData(): Object {
        if (this.encounterState) {
            return this.encounterState.windowData;
        }

        return undefined;
    }

	get config(): EncounterConfigData {
		if (this.encounterState) {
			return this.encounterState.configState;
		}

		return {
			lightEnabled: false,
			ambientLight: LightValue.FULL,
			playerVisibilityMode: PlayerVisibilityMode.PLAYER,
			mapEnabled: false,
			playerWallsEnabled: true,
			showHealth: false,
		};
	}

	set config(value: EncounterConfigData) {
		if (this.encounterState) {
			this.encounterState.configState.setEncounterConfigData(value);
		}
	}

	get configChangeObservable(): Observable<void> {
		return this.encounterState.configState.changeObservable;
	}

	public getSerializedConfig(): EncounterConfigData {
		return {
			lightEnabled: this.encounterState.configState.lightEnabled,
			ambientLight: this.encounterState.configState.ambientLight,
			playerVisibilityMode: this.encounterState.configState.playerVisibilityMode,
			mapEnabled: this.encounterState.configState.mapEnabled,
			playerWallsEnabled: this.encounterState.configState.playerWallsEnabled,
			showHealth: this.encounterState.configState.showHealth
		}
	}

	get teams(): string[] {
		if (this.encounterState) {
			return this.encounterState.teamsData.teams;
		}

		return [];
	}

	set teams(teams: string[]) {
		if (this.encounterState) {
			this.encounterState.teamsData.teams = teams;
		}
	}

	get teamsChangeObservable(): Observable<void> {
		return this.encounterState.teamsChangeObservable;
	}

	get users(): TeamUser[] {
		if (this.encounterState) {
			return this.encounterState.users;
		}

		return [];
	}

	get teamsData(): EncounterTeamsData {
		return this.encounterState.teamsData;
	}

	set teamsData(value) {
		this.encounterState.teamsData = value;
	}

	get gameMasters(): string[] {
		if (this.encounterState) {
			return this.encounterState.gameMasters;
		}

		return [];
	}

	get lightSources(): LightSourceData[] {
		if (this.encounterState) {
			return this.encounterState.lightSources;
		}

		return [];
	}

	get campaignId(): string {
		return this.encounterState.campaignId;
	}
}
