import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {BoardLightService} from "../../services/board-light.service";

@Component({
    selector: 'light-edit-dialog',
    templateUrl: 'light-edit-dialog.component.html',
    styleUrls: ['light-edit-dialog.component.scss']
})

export class LightEditDialogComponent {

    newBright: number;
    newDim: number;

    constructor(@Inject(MAT_DIALOG_DATA) data: any,
                private dialogRef: MatDialogRef<LightEditDialogComponent>) {
        const lightSource = data.lightSource;
        this.newBright = lightSource.bright_range;
        this.newDim = lightSource.dim_range;
    }

    public saveAndClose() {
        const lightRanges = {
            bright_range: this.newBright,
            dim_range: this.newDim
        };
        this.dialogRef.close(lightRanges);
    }
}
