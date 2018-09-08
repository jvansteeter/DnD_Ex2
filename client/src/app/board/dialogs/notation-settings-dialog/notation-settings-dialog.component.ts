import {Component} from "@angular/core";
import {BoardStateService} from "../../services/board-state.service";
import {BoardNotationService} from "../../services/board-notation-service";
import {NotationMode} from "../../shared/enum/notation-mode";

@Component({
    selector: 'notation-settings-dialog',
    templateUrl: 'src/app/board/dialogs/notation-settings-dialog/notation-settings-dialog.component.html',
    styleUrls: ['src/app/board/dialogs/notation-settings-dialog/notation-settings-dialog.component.scss']
})

export class NotationSettingsDialogComponent {
    constructor(
        public boardStateService: BoardStateService,
        public boardNotationService: BoardNotationService
    ) {
    }

    public NotationMode = NotationMode;

    public increaseBrushSize() {
        this.boardStateService.brush_size++;
    }

    public decreaseBrushSize() {
        if (this.boardStateService.brush_size > 0) { this.boardStateService.brush_size--; }
    }
}