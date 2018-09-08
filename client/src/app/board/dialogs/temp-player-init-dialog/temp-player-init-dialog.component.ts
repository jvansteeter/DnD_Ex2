import {Component} from "@angular/core";
import {BoardPlayerService} from "../../services/board-player.service";

@Component({
    selector: 'temp-player-init-dialog',
    templateUrl: 'temp-player-init-dialog.component.html',
    styleUrls: ['temp-player-init-dialog.component.scss']
})

export class TempPlayerInitDialogComponent {
    constructor(
        private boardPlayerService: BoardPlayerService,
    ){}
}