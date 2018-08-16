import {Component} from "@angular/core";
import {NotationIconSelectorComponent} from "../notation-icon-selector/notation-icon-selector.component";
import {MatDialogRef} from "@angular/material";
import {BoardNotationService} from "../../services/board-notation-service";

@Component({
    selector: 'text-edit-dialog',
    templateUrl: 'notation-text-edit-dialog.component.html',
    styleUrls: ['notation-text-edit-dialog.component.scss']
})

export class NotationTextEditDialogComponent {
    public textField: string;
    public fontSize: number;

    constructor(
        public dialogRef: MatDialogRef<NotationIconSelectorComponent>,
        private boardNotationService: BoardNotationService
    ) {
        this.fontSize = 10;
    }

    public doAThing() {
        this.boardNotationService.getActiveNotation().addTextNotation(this.textField);
        this.dialogRef.close();
    }

    public increaseFontSize() {
        this.fontSize = this.fontSize + 5;
    }

    public decreaseFontSize() {
        if (this.fontSize > 5) {
            this.fontSize = this.fontSize - 5;
        }
    }
}