import {Component} from "@angular/core";
import {BoardStateService} from "../../../services/board-state.service";
import {BoardMode} from "../../../shared/enum/board-mode";
import {ViewMode} from "../../../shared/enum/view-mode";

@Component({
    selector: 'view-edit-module',
    templateUrl: 'view-edit-control-module.component.html',
    styleUrls: ['view-edit-control-module.component.scss']
})

export class ViewEditControlModuleComponent {
    public BoardMode = BoardMode;

    currentView: string;
    viewModes: string[] = [
        'Board Maker',
        'Player View',
        'Game Master'
    ];

    currentInput: string;

    constructor (
        private boardStateService: BoardStateService
    )
    {
        this.sync();
    }

    sync() {
        switch (this.boardStateService.board_edit_mode) {
            case BoardMode.PLAYER:
                this.currentInput = 'Player';
                break;
            case BoardMode.WALLS:
                this.currentInput = 'Walls';
                break;
            case BoardMode.DOORS:
                this.currentInput = 'Doors';
                break;
            case BoardMode.LIGHTS:
                this.currentInput = 'Lights';
                break;
        }

        switch (this.boardStateService.board_view_mode) {
            case ViewMode.BOARD_MAKER:
                this.currentView = 'Board Maker';
                break;
            case ViewMode.PLAYER:
                this.currentView = 'Player View';
                break;
            case ViewMode.MASTER:
                this.currentView = 'Game Master';
                break;
        }
    }

    public handleViewChange() {
        switch (this.currentView) {
            case 'Board Maker':
                this.boardStateService.source_click_location = null;
                this.boardStateService.board_view_mode = ViewMode.BOARD_MAKER;
                this.boardStateService.board_edit_mode = BoardMode.WALLS;
                this.boardStateService.do_pops = false;
                break;
            case 'Player View':
                this.boardStateService.source_click_location = null;
                this.boardStateService.board_view_mode = ViewMode.PLAYER;
                this.boardStateService.board_edit_mode = BoardMode.PLAYER;
                this.boardStateService.do_pops = true;
                this.boardStateService.show_health = false;
                break;
            case 'Game Master':
                this.boardStateService.source_click_location = null;
                this.boardStateService.board_view_mode = ViewMode.MASTER;
                this.boardStateService.board_edit_mode = BoardMode.PLAYER;
                this.boardStateService.do_pops = true;
                break;
        }
        this.sync()
    }

    public handleSetInputModePlayer() {
        this.boardStateService.source_click_location = null;
        this.boardStateService.board_edit_mode = BoardMode.PLAYER;
        this.boardStateService.doDiagonals = false;
        this.boardStateService.inputOffset = 0;
        this.sync();
    }

    public handleSetInputModeDoor() {
        this.boardStateService.source_click_location = null;
        this.boardStateService.board_edit_mode = BoardMode.DOORS;
        this.boardStateService.inputOffset = 0.10;
        this.boardStateService.doDiagonals = true;
        this.sync();
    }

    public handleSetInputModeWall() {
        this.boardStateService.board_edit_mode = BoardMode.WALLS;
        this.boardStateService.inputOffset = 0.2;
        this.boardStateService.doDiagonals = true;
        this.sync();
    }

    public handleSetInputModeLight() {
        this.boardStateService.source_click_location = null;
        this.boardStateService.board_edit_mode = BoardMode.LIGHTS;
        this.boardStateService.inputOffset = 0;
        this.boardStateService.doDiagonals = false;
        this.sync();
    }
}