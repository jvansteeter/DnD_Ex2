import { ConcurrentBoardObject } from './concurrent-board-object';
import { EncounterTeamsData } from '../../../../shared/types/encounter/encounter-teams.data';
import { TeamUser } from '../board/services/team-user';
import { isUndefined } from "util";

export class EncounterTeamsState extends ConcurrentBoardObject {
	private _teams: string[];
	private _users: Map<string, TeamUser>;

	constructor(data: EncounterTeamsData) {
		super();

		this._teams = data.teams;
		this._users = new Map<string, TeamUser>();
		for (let user of data.users) {
			this._users.set(user.userId, new TeamUser(user));
		}
	}

	public setEncounterTeamsData(data: EncounterTeamsData): void {
		this._teams = data.teams;
		for (let user of data.users) {
			const existingUser = this._users.get(user.userId);
			if (isUndefined(existingUser)) {
				this._users.set(user.userId, new TeamUser(user));
			}
			else {
				existingUser.teams = user.teams;
			}
		}
	}

	public addTeam(team: string): void {
		this._teams.push(team);
		this.emitChange();
	}

	public removeTeam(team: string): void {
		for (let i = 0; i < this._teams.length; i++) {
			if (team === this._teams[i]) {
				this._teams.splice(i, 1);
				this.emitChange();
				return;
			}
		}
	}

	public toggleUserTeam(userId: string, team: string): void {
		 const user = this._users.get(userId);
		 user.toggleTeam(team);
		 this.emitChange();
	}

	public serialized(): EncounterTeamsData {
		return {
			users: this.getSerializedUsers(),
			teams: this._teams,
		}
	}

	get teams(): string[] {
		return this._teams;
	}

	set teams(value) {}

	get users(): TeamUser[] {
		return [...this._users.values()];
	}

	set users(value) {}

	private getSerializedUsers(): {userId: string, username: string, teams: string[]}[] {
		const users = [];
		for (let user of this.users) {
			users.push(user.getSerialized())
		}

		return users;
	}
}
