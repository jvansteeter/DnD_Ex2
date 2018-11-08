import { ConcurrentBoardObject } from './concurrent-board-object';
import { EncounterTeamsData } from '../../../../shared/types/encounter/encounter-teams.data';

export class EncounterTeamsState extends ConcurrentBoardObject implements EncounterTeamsData {
	private _teams: string[];
	private _users: [{ userId: string; teams: string[] }];

	constructor() {
		super();
	}

	public setEncounterTeamsData(data: EncounterTeamsData): void {
		this._teams = data.teams;
		this._users = data.users;
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
		for (let userObj of this._users) {
			if (userObj.userId === userId) {
				for (let i = 0; i < userObj.teams.length; i++) {
					if (team === userObj.teams[i]) {
						userObj.teams.splice(i, 1);
						this.emitChange();
						return;
					}
				}
				userObj.teams.push(team);
				this.emitChange();
			}
		}
	}

	public serialized(): EncounterTeamsData {
		return {
			users: this._users,
			teams: this._teams,
		}
	}

	get teams(): string[] {
		return this._teams;
	}

	set teams(value) {}

	get users() {
		return this._users;
	}

	set users(value) {}
}
