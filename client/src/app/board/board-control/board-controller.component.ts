import { BoardStateService } from '../services/board-state.service';
import { ViewMode } from '../shared/enum/view-mode';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddPlayerDialogComponent } from '../dialogs/add-player-dialog/add-player-dialog.component';
import { EncounterService } from '../../encounter/encounter.service';
import { BoardVisibilityService } from "../services/board-visibility.service";
import { TeamSettingsComponent } from '../dialogs/team-settings/team-settings.component';
import { RightsService } from '../../data-services/rights.service';
import { RulesConfigService } from '../../data-services/rules-config.service';

@Component({
	selector: 'board-controller',
	templateUrl: 'board-controller.component.html',
	styleUrls: ['board-controller.component.scss']
})

export class BoardControllerComponent implements OnInit, OnDestroy {
	public ViewMode = ViewMode;

	constructor(public boardStateService: BoardStateService,
	            public boardVisibilityService: BoardVisibilityService,
	            public encounterService: EncounterService,
	            public rightsService: RightsService,
	            public rulesConfigService: RulesConfigService,
	            private dialog: MatDialog,
	) {
	}

	ngOnInit(): void {
	}

	ngOnDestroy(): void {
	}

	addPlayer(): void {
		this.dialog.open(AddPlayerDialogComponent, {
			data: {
				campaignId: this.encounterService.campaignId
			}
		});
	}

	openTeamSettings(): void {
		this.dialog.open(TeamSettingsComponent);
	}

	exportEncounterJson(): void {
		this.boardStateService.getExportJson();
	}

	public incrementRound(): void {
		this.encounterService.incrementRound();
	}

	public toggleToolBar(): void {
		this.boardStateService.toolbarIsHidden = !this.boardStateService.toolbarIsHidden;
	}

	public refreshEncounter(): void {
		this.encounterService.refresh();
	}
}
