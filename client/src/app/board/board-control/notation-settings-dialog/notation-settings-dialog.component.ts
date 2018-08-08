import {Component} from "@angular/core";
import {BoardStateService} from "../../services/board-state.service";

@Component({
    selector: 'notation-settings-dialog',
    templateUrl: 'notation-settings-dialog.component.html',
    styleUrls: ['notation-settings-dialog.component.scss']
})

export class NotationSettingsDialogComponent {
    constructor(
        public boardStateService: BoardStateService,
    ) {
    }
}