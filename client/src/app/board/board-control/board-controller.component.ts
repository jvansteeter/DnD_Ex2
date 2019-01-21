import { BoardStateService } from '../services/board-state.service';
import { ViewMode } from '../shared/enum/view-mode';
import { BoardMode } from '../shared/enum/board-mode';
import { BoardControllerMode } from '../shared/enum/board-controller-mode'
import { BoardLightService } from '../services/board-light.service';
import { PlayerVisibilityMode } from "../../../../../shared/types/encounter/board/player-visibility-mode";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NotationMode } from '../shared/enum/notation-mode';
import { NotationVisibility } from "../../../../../shared/types/encounter/board/notation-visibility";
import { AddPlayerDialogComponent } from '../dialogs/add-player-dialog/add-player-dialog.component';
import { EncounterService } from '../../encounter/encounter.service';
import { BoardVisibilityService } from "../services/board-visibility.service";
import { TeamSettingsComponent } from '../dialogs/team-settings/team-settings.component';
import { RightsService } from '../../data-services/rights.service';

@Component({
	selector: 'board-controller',
	templateUrl: 'board-controller.component.html',
	styleUrls: ['board-controller.component.scss']
})

export class BoardControllerComponent implements OnInit, OnDestroy {
	public NotationVisibility = NotationVisibility;
	public NotationMode = NotationMode;
	public ViewMode = ViewMode;
	public BoardMode = BoardMode;
	public BoardControllerMode = BoardControllerMode;
	public PlayerVisibilityMode = PlayerVisibilityMode;

	constructor(public boardStateService: BoardStateService,
	            public boardLightService: BoardLightService,
	            public boardVisibilityService: BoardVisibilityService,
	            private encounterService: EncounterService,
	            public rightsService: RightsService,
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

	public toggleToolBar(): void {
		this.boardStateService.toolbarIsHidden = !this.boardStateService.toolbarIsHidden;
	}
}
