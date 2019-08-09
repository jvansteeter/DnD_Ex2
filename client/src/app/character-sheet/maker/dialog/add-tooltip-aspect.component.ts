import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Aspect } from '../../shared/aspect';
import { AlertService } from '../../../alert/alert.service';
import { IconList } from '../../../utilities/icon-list';

@Component({
	templateUrl: 'add-tooltip-aspect.component.html',
	styleUrls: ['add-tooltip-aspect.component.scss']
})
export class AddTooltipAspectComponent {
	public aspects: Aspect[];
	public selectedLabel: string;
	public selectedIcon: string;

	public iconOptions = IconList;

	private iconHasBeenSelected: boolean = false;

	constructor(private dialogRef: MatDialogRef<AddTooltipAspectComponent>,
	            @Inject(MAT_DIALOG_DATA) data: any,
	            private alertService: AlertService) {
		this.aspects = data.aspects;
	}

	public selectIcon(icon: string): void {
		this.iconHasBeenSelected = true;
		this.selectedIcon = icon;
	}

	public submit(): void {
		if ((this.selectedLabel !== undefined && this.selectedLabel !== '') && (this.selectedIcon !== null && this.selectedIcon !== undefined)) {
			this.dialogRef.close({
				icon: this.selectedIcon,
				label: this.selectedLabel
			});
		}
		else {
			this.alertService.showAlert('Select an Aspect and an Icon');
		}
	}
}
