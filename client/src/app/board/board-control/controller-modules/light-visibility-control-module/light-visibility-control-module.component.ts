import { Component, OnInit } from "@angular/core";
import { BoardStateService } from "../../../services/board-state.service";
import { PlayerVisibilityMode } from "../../../../../../../shared/types/encounter/board/player-visibility-mode";
import { LightValue } from "../../../../../../../shared/types/encounter/board/light-value";
import { BoardLightService } from "../../../services/board-light.service";
import { ViewMode } from "../../../shared/enum/view-mode";
import { EncounterService } from '../../../../encounter/encounter.service';

@Component({
    selector: 'light-visibility-module',
    templateUrl: 'light-visibility-control-module.component.html',
    styleUrls: ['light-visibility-control-module.component.scss']
})

export class LightVisibilityControlModuleComponent implements OnInit {
    currentVisibility: string;

    ViewMode = PlayerVisibilityMode;
    visibilityModes: PlayerVisibilityMode[] = [
        PlayerVisibilityMode.GLOBAL,
		    PlayerVisibilityMode.TEAM,
		    PlayerVisibilityMode.PLAYER,
    ];

    constructor(
        private boardStateService: BoardStateService,
        private boardLightService: BoardLightService,
        public encounterService: EncounterService,
    ) {
    }

    public ngOnInit(): void {
    	this.currentVisibility = this.encounterService.config.playerVisibilityMode;
    }

    onVisibilityChange() {
        switch (this.currentVisibility) {
            case 'Global':
                this.encounterService.config.playerVisibilityMode = PlayerVisibilityMode.GLOBAL;
                break;
            case 'Team':
                this.encounterService.config.playerVisibilityMode = PlayerVisibilityMode.TEAM;
                break;
            case 'Player':
                this.encounterService.config.playerVisibilityMode = PlayerVisibilityMode.PLAYER;
                break;
        }
        this.sync()
    }

    sync() {
        switch (this.encounterService.config.playerVisibilityMode) {
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

    showLightControls(): boolean {
        return this.boardStateService.board_view_mode === ViewMode.BOARD_MAKER || this.boardStateService.board_view_mode === ViewMode.MASTER;
    }

    increaseAmbientLight(): void {
        if (this.encounterService.config.ambientLight === LightValue.DARK) {
            this.encounterService.config.ambientLight = LightValue.DIM;
        } else if (this.encounterService.config.ambientLight === LightValue.DIM) {
            this.encounterService.config.ambientLight = LightValue.FULL;
        }
        this.boardLightService.updateAllLightValues();
    }

    decreaseAmbientLight(): void {
        if (this.encounterService.config.ambientLight === LightValue.FULL) {
            this.encounterService.config.ambientLight = LightValue.DIM;
        } else if (this.encounterService.config.ambientLight === LightValue.DIM) {
            this.encounterService.config.ambientLight = LightValue.DARK;
        }
        this.boardLightService.updateAllLightValues();
    }

    getLightValue(): string {
        switch (this.encounterService.config.ambientLight) {
            case LightValue.DARK:
                return 'Dark';
            case LightValue.DIM:
                return 'Dim';
            case LightValue.FULL:
                return 'Full';
        }
    }
}