import { Injectable } from "@angular/core";
import { BoardStateService } from "../board/services/board-state.service";
import { ViewMode } from "../board/shared/enum/view-mode";
import { BoardMode } from "../board/shared/enum/board-mode";
import { MatDialog, MatDialogRef } from "@angular/material";
import { AddPlayerDialogComponent } from "../board/dialogs/add-player-dialog/add-player-dialog.component";
import { EncounterService } from "./encounter.service";
import { TeamSettingsComponent } from "../board/dialogs/team-settings/team-settings.component";

@Injectable()
export class EncounterKeyEventService {

	constructor(private stateService: BoardStateService,
	            private encounterService: EncounterService,
	            private dialog: MatDialog) {

	}

	public keyup(event): void {
		switch (event.code) {
			case 'KeyE':
				this.cycleEditMode();
				return;
			case 'KeyV':
				this.toggleViewMode();
				return;
			case 'KeyT':
				this.toggleToolbar();
				return;
			case 'KeyP':
				this.openAddPlayerDialog();
				return;
			case 'KeyR':
				this.refreshEncounterData();
				return;
			case 'KeyS':
				this.openTeamSettingsDialog();
				return;
			case 'KeyI':
				this.incrementRound();
				return;
		}
	}

	private toggleViewMode(): void {
		if (this.stateService.board_view_mode === ViewMode.BOARD_MAKER) {
			this.stateService.set_viewMode_gameMaster();
		}
		else if (this.stateService.board_view_mode === ViewMode.MASTER) {
			this.stateService.set_viewMode_player();
		}
		else if (this.stateService.board_view_mode === ViewMode.PLAYER) {
			this.stateService.set_viewMode_boardMaker();
		}
	}

	private toggleToolbar(): void {
		this.stateService.toolbarIsHidden = !this.stateService.toolbarIsHidden;
	}

	private cycleEditMode(): void {
		switch (this.stateService.board_edit_mode) {
			case BoardMode.PLAYER:
				this.stateService.set_inputMode_door();
				return;
			case BoardMode.DOORS:
				this.stateService.set_inputMode_walls();
				return;
			case BoardMode.WALLS:
				this.stateService.set_inputMode_lights();
				return;
			case BoardMode.LIGHTS:
				this.stateService.set_inputMode_window();
				return;
			case BoardMode.WINDOW:
				this.stateService.set_inputMode_player();
				return;
		}
	}

	private openAddPlayerDialog(): void {
		const openDialogs: MatDialogRef<any>[] = this.dialog.openDialogs;
		if (openDialogs.length > 0) {
			this.dialog.closeAll();
		}
		else {
			this.dialog.open(AddPlayerDialogComponent, {
				data: {
					campaignId: this.encounterService.campaignId
				}
			});
		}
	}

	private openTeamSettingsDialog(): void {
		const openDialogs: MatDialogRef<any>[] = this.dialog.openDialogs;
		if (openDialogs.length > 0) {
			this.dialog.closeAll();
		}
		else {
			this.dialog.open(TeamSettingsComponent);
		}
	}

	private refreshEncounterData(): void {
		this.encounterService.refresh();
	}

	private incrementRound(): void {
		this.encounterService.incrementRound();
	}
}
