import { BoardStateService } from '../services/board-state.service';
import { BoardTileService } from '../services/board-tile.service';
import { ViewMode } from '../shared/enum/view-mode';
import { BoardMode } from '../shared/enum/board-mode';
import { BoardControllerMode } from '../shared/enum/board-controller-mode'
import { LightValue } from '../shared/enum/light-value';
import { BoardLightService } from '../services/board-light.service';
import { PlayerVisibilityMode } from "../shared/enum/player-visibility-mode";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NotationMode } from '../shared/enum/notation-mode';
import { BoardNotationService } from '../services/board-notation-service';
import { NotationVisibility } from "../../../../../shared/types/encounter/board/notation-visibility";
import { NotationIconSelectorComponent } from "../dialogs/notation-icon-selector/notation-icon-selector.component";
import { NotationColorSelectorComponent } from "../dialogs/notation-color-selector/notation-color-selector.component";
import { NotationSettingsDialogComponent } from "../dialogs/notation-settings-dialog/notation-settings-dialog.component";
import { AddPlayerDialogComponent } from '../dialogs/add-player-dialog/add-player-dialog.component';
import { EncounterService } from '../../encounter/encounter.service';
import { NotationTextCreateDialogComponent } from "../dialogs/notation-text-dialog/notation-text-create-dialog.component";
import { BoardVisibilityService } from "../services/board-visibility.service";
import { XyPair } from "../../../../../shared/types/encounter/board/xy-pair";
import { RightsService } from '../../data-services/rights.service';
import { Subscription } from 'rxjs';

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

    private rightsSubscription: Subscription;

    currentVisibility: string;
    visibilityModes: string[] = [
        'Global',
        'Team',
        'Player'
    ];

    constructor(public boardStateService: BoardStateService,
                public boardLightService: BoardLightService,
                public boardVisibilityService: BoardVisibilityService,
                public notationService: BoardNotationService,
                private encounterService: EncounterService,
                public ts: BoardTileService,
                private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.sync();
    }

    ngOnDestroy(): void {
    	this.rightsSubscription.unsubscribe();
    }

    showLightControls(): boolean {
        return this.boardStateService.board_view_mode === ViewMode.BOARD_MAKER || this.boardStateService.board_view_mode === ViewMode.MASTER;
    }

    sync() {
        switch (this.boardStateService.playerVisibilityMode) {
            case PlayerVisibilityMode.GLOBAL:
                this.currentVisibility = 'Global';
                break;
            case PlayerVisibilityMode.TEAM:
                this.currentVisibility = 'Team';
                break;
            case PlayerVisibilityMode.PLAYER:
                this.currentVisibility = 'Player';
                break;
        }
    }

    onVisibilityChange() {
        switch (this.currentVisibility) {
            case 'Global':
                this.boardStateService.playerVisibilityMode = PlayerVisibilityMode.GLOBAL;
                break;
            case 'Team':
                this.boardStateService.playerVisibilityMode = PlayerVisibilityMode.TEAM;
                break;
            case 'Player':
                this.boardStateService.playerVisibilityMode = PlayerVisibilityMode.PLAYER;
                break;
        }
        this.sync()
    }

    diag_raytraceInputChange(event) {
        if (this.encounterService.players.length > 0){
            const playerLoc = this.encounterService.players[0].location;
            const cell_res = BoardStateService.cell_res;
            const playerRes = new XyPair(playerLoc.x * cell_res + cell_res / 2, playerLoc.y * cell_res + cell_res / 2);
            this.boardVisibilityService.raytraceVisibilityFromCell(playerRes, this.boardStateService.diag_visibility_ray_count);
        }
    }

    increaseAmbientLight(): void {
        if (this.boardStateService.ambientLight === LightValue.DARK) {
            this.boardStateService.ambientLight = LightValue.DIM;
        } else if (this.boardStateService.ambientLight === LightValue.DIM) {
            this.boardStateService.ambientLight = LightValue.FULL;
        }
        this.boardLightService.updateAllLightValues();
    }

    decreaseAmbientLight(): void {
        if (this.boardStateService.ambientLight === LightValue.FULL) {
            this.boardStateService.ambientLight = LightValue.DIM;
        } else if (this.boardStateService.ambientLight === LightValue.DIM) {
            this.boardStateService.ambientLight = LightValue.DARK;
        }
        this.boardLightService.updateAllLightValues();
    }

    getLightValue(): string {
        switch (this.boardStateService.ambientLight) {
            case LightValue.DARK:
                return 'Dark';
            case LightValue.DIM:
                return 'Dim';
            case LightValue.FULL:
                return 'Full';
        }
    }

    addPlayer(): void {
        this.dialog.open(AddPlayerDialogComponent, {data: {
        	  campaignId: this.encounterService.encounterState.campaignId
        }});
    }

    handleAddNotation() {
        this.notationService.addNewNotation().subscribe(() => {
		        this.boardStateService.isEditingNotation = true;
		        this.notationService.activeNotationMode = NotationMode.CELL;
        });
    }

    handleDeleteNotation() {
        this.notationService.deleteActiveNotation();
    }

    handleEditNotation(notationId: string) {
        this.boardStateService.isEditingNotation = true;
        this.notationService.activeNotationId = notationId;
        this.notationService.activeNotationMode = NotationMode.CELL;
    }

    handleFinishNotation() {
        this.boardStateService.isEditingNotation = false;
        this.notationService.activeNotationId = null;
    }

    handleSetNotationModeToCell() {
        this.notationService.activeNotationMode = NotationMode.CELL;
    }

    handleSetNotationModeToPointToPoint() {
        this.notationService.activeNotationMode = NotationMode.POINT_TO_POINT;
    }

    handleSetNotationModeToFreeform() {
        this.notationService.activeNotationMode = NotationMode.FREEFORM;
    }

    openIconDialog() {
        this.dialog.open(NotationIconSelectorComponent,{});
    }

    openColorDialog() {
        this.dialog.open(NotationColorSelectorComponent);
    }

    openSettingDialog() {
        this.dialog.open(NotationSettingsDialogComponent);
    }

    openTextNotationDialog() {
        this.notationService.returnToMeNotationMode = this.notationService.activeNotationMode;
        this.notationService.activeNotationMode = NotationMode.TEXT;
        this.dialog.open(NotationTextCreateDialogComponent);
    }
}
