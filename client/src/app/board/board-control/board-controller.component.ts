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
import { EncounterKeyEventService } from "../../encounter/encounter-key-event.service";
import { first } from "rxjs/operators";

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
	            private keyEventService: EncounterKeyEventService,
	            private dialog: MatDialog,
	) {
	}

	ngOnInit(): void {
	}

	ngOnDestroy(): void {
	}

	addPlayer(): void {
		this.keyEventService.stopListeningToKeyEvents();
		this.dialog.open(AddPlayerDialogComponent, {
			data: {
				campaignId: this.encounterService.campaignId
			}
		}).afterClosed().pipe(first()).subscribe(() => this.keyEventService.startListeningToKeyEvents());
	}

	openTeamSettings(): void {
		this.keyEventService.stopListeningToKeyEvents();
		this.dialog.open(TeamSettingsComponent).afterClosed().pipe(first()).subscribe(() => this.keyEventService.startListeningToKeyEvents());
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
