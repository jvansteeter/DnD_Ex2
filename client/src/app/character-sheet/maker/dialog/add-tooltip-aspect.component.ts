import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";

@Component({
	templateUrl: 'add-tooltip-aspect.component.html'
})
export class AddTooltipAspectComponent {
	constructor(private dialogRef: MatDialogRef<AddTooltipAspectComponent>) {

	}
}
