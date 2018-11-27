export class TeamUser {
	private userId: string;
	private username: string;
	private teams: string[];

	constructor(userId: string, username: string, teams: string[]) {
		this.userId = userId;
		this.username = username;
		this.teams = teams;
	}

	public isMemberOfTeam(team: string): boolean {
		for (let userTeam of this.teams) {
			if (team === userTeam) {
				return true;
			}
		}

		return false;
	}

	public toggleTeam(team: string): void {
		if (this.isMemberOfTeam(team)) {
			this.removeTeam(team);
		}
		else {
			this.addTeam(team);
		}
	}

	public addTeam(team: string): void {
		this.teams.push(team);
	}

	public removeTeam(team: string): void {
		for (let i = 0; i < this.teams.length; i++) {
			if (team === this.teams[i]) {
				this.teams.splice(i, 1);
				return;
			}
		}
	}

	get id(): string {
		return this.userId;
	}

	public getSerialized(): any {
		return {
			userId: this.userId,
			username: this.username,
			teams: this.teams,
		}
	}
}