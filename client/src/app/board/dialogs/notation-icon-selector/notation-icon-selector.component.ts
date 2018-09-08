import {Component} from "@angular/core";
import {MatDialogRef} from "@angular/material";
import {BoardNotationService} from "../../services/board-notation-service";

@Component({
    selector: 'notation-icon-selector',
    templateUrl: 'src/app/board/dialogs/notation-icon-selector/notation-icon-selector.component.html',
    styleUrls: ['src/app/board/dialogs/notation-icon-selector/notation-icon-selector.component.scss']
})

export class NotationIconSelectorComponent {
    iconIds = ['accessibility','alarm','all_out','android','invert_colors','language','loyalty','store','stars', 'whatshot'];
    dimension: string;

    constructor(
        public dialogRef: MatDialogRef<NotationIconSelectorComponent>,
        private boardNotationService: BoardNotationService
    ) {
        this.dimension = (Math.ceil(this.iconIds.length ** 0.5) * 42) + 2 + 'px';
    }

    commitIcon(iconId: string) {
        this.boardNotationService.getActiveNotation().iconTag = iconId;
        this.dialogRef.close();
    }
}