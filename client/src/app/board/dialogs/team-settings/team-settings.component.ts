import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { EncounterService } from '../../../encounter/encounter.service';
import { Player } from '../../../encounter/player';

@Component({
	templateUrl: 'team-settings.component.html',
	styleUrls: ['team-settings.component.scss']
})
export class TeamSettingsComponent implements OnInit {
	public teamTableCols = ['name'];
	public newTeam: string = '';

	constructor(public encounterService: EncounterService) {}

	public ngOnInit(): void {
		this.teamTableCols.push(...this.encounterService.teams);
	}

	public toggleTeam(team: string, player: Player): void {
		player.toggleTeam(team);
	}

	public addTeam(): void {
		for (let existingTeam of this.encounterService.teams) {
			if (this.newTeam === existingTeam) {
				this.newTeam = '';
				return;
			}
		}
		this.encounterService.addTeam(this.newTeam);
		this.teamTableCols.push(this.newTeam);
		this.newTeam = '';
	}

	public removeTeam(team): void {
		this.encounterService.removeTeam(team);
		for (let i = 0; i < this.teamTableCols.length; i++) {
			if (team === this.teamTableCols[i]) {
				this.teamTableCols.splice(i, 1);
				return;
			}
		}
	}
}
