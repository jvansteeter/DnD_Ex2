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
    public ViewMode = ViewMode;

    currentView: string;
    viewModes: string[] = [
        'Board Maker',
        'Player View',
        'Game Master'
    ];

    constructor (
        private boardStateService: BoardStateService
    )
    {
        this.sync();
    }

    sync() {
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
                this.boardStateService.set_viewMode_boardMaker();
                break;
            case 'Player View':
                this.boardStateService.set_viewMode_player();
                break;
            case 'Game Master':
                this.boardStateService.set_viewMode_gameMaster();
                break;
        }
        this.sync()
    }
}