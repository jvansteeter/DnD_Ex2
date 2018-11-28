import { Component, OnInit } from '@angular/core';
import { Player } from '../../../encounter/player';
import { isNullOrUndefined } from 'util';
import { BoardTeamsService } from '../../services/board-teams.service';
import { EncounterService } from '../../../encounter/encounter.service';
import { TeamUser } from "../../services/team-user";

@Component({
	templateUrl: 'team-settings.component.html',
	styleUrls: ['team-settings.component.scss']
})
export class TeamSettingsComponent implements OnInit {
	public tokenTableCols = ['token'];
	public userTableCols = ['user'];
	public newTeam: string = '';

	constructor(public teamsService: BoardTeamsService,
	            public encounterService: EncounterService) {}

	public ngOnInit(): void {
		this.tokenTableCols.push(...this.teamsService.teams);
		this.userTableCols.push(...this.teamsService.teams);
	}

	public toggleTokenTeam(player: Player, team: string): void {
		player.toggleTeam(team);
	}

	public toggleUserTeam(user: TeamUser, team: string): void {
		this.teamsService.toggleUserTeam(user.id, team);
	}

	public addTeam(): void {
		if (isNullOrUndefined(this.newTeam) || this.newTeam === '') {
			return;
		}
		for (let existingTeam of this.teamsService.teams) {
			if (this.newTeam === existingTeam) {
				this.newTeam = '';
				return;
			}
		}
		this.teamsService.addTeam(this.newTeam);
		this.tokenTableCols.push(this.newTeam);
		this.userTableCols.push(this.newTeam);
		this.newTeam = '';
	}

	public removeTeam(team): void {
		this.teamsService.removeTeam(team);
		for (let i = 0; i < this.tokenTableCols.length; i++) {
			if (team === this.tokenTableCols[i]) {
				this.tokenTableCols.splice(i, 1);
				this.userTableCols.splice(i, 1);
				return;
			}
		}
	}
}
