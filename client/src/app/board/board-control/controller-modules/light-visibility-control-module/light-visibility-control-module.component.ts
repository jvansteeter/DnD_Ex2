import {Component} from "@angular/core";
import {BoardStateService} from "../../../services/board-state.service";
import {PlayerVisibilityMode} from "../../../shared/enum/player-visibility-mode";
import {LightValue} from "../../../shared/enum/light-value";
import {BoardLightService} from "../../../services/board-light.service";
import {ViewMode} from "../../../shared/enum/view-mode";

@Component({
    selector: 'light-visibility-module',
    templateUrl: 'light-visibility-control-module.component.html',
    styleUrls: ['light-visibility-control-module.component.scss']
})

export class LightVisibilityControlModuleComponent {
    currentVisibility: string;
    visibilityModes: string[] = [
        'Global',
        'Team',
        'Player'
    ];

    constructor(
        private boardStateService: BoardStateService,
        private boardLightService: BoardLightService,
    ) {}

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

    showLightControls(): boolean {
        return this.boardStateService.board_view_mode === ViewMode.BOARD_MAKER || this.boardStateService.board_view_mode === ViewMode.MASTER;
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
}