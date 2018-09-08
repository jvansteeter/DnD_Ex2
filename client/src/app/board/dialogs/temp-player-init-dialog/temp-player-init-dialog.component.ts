import {Component, HostListener} from "@angular/core";
import {BoardPlayerService} from "../../services/board-player.service";
import {MatDialogRef} from "@angular/material";

@Component({
    selector: 'temp-player-init-dialog',
    templateUrl: 'temp-player-init-dialog.component.html',
    styleUrls: ['temp-player-init-dialog.component.scss']
})

export class TempPlayerInitDialogComponent {
    constructor(
        private boardPlayerService: BoardPlayerService,
        public dialogRef: MatDialogRef<TempPlayerInitDialogComponent>,
    ){}

    @HostListener('document:keydown', ['$event'])
    handleKeyDownEvent(event: KeyboardEvent) {
        const key_code = event.code;
        switch (key_code) {
            case 'Enter' :
                this.dialogRef.close();
                break;
        }
    }
}