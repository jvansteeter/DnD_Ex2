import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Aspect } from '../../shared/aspect';
import { AlertService } from '../../../alert/alert.service';

@Component({
	templateUrl: 'add-tooltip-aspect.component.html',
	styleUrls: ['add-tooltip-aspect.component.scss']
})
export class AddTooltipAspectComponent {
	public aspects: Aspect[];
	public selectedLabel: string;
	public selectedIcon: string;

	public iconOptions = [
			'account_balance',
			'account_circle',
			'account_box',
			'all_out',
			'bookmark',
			'book',
			'check_circle',
			'done',
			'face',
			'fingerprint',
			'favorite',
			'extension',
			'find_in_page',
			'gavel',
			'grade',
			'home',
			'hourglass_empty',
			'hourglass_full',
			'https',
			'label',
			'label_important',
			'language',
			'offline_bolt',
			'opacity',
			'pets',
			'settings',
			'supervisor_account',
			'turned_in',
			'visibility',
			'visibility_off',
			'error',
			'call_made',
			'vpn_key',
			'add',
			'clear',
			'create',
			'block',
			'link',
			'flag',
			'brightness_high',
			'brightness_low',
			'gps_fixed',
			'gps_not_fixed',
			'attach_money',
			'monetization_on',
			'scatter_plot',
			'short_text',
			'cloud',
			'keyboard_arrow_up',
			'keyboard_arrow_down',
			'keyboard_arrow_left',
			'keyboard_arrow_right',
			'security',
			'brightness_2',
			'brightness_3',
			'brush',
			'blur_on',
			'color_lens',
			'details',
			'flash_on',
			'texture',
			'local_cafe',
			'local_drink',
			'local_dining',
			'near_me',
			'ac_unit',
			'whatshot',
			'public'
	];

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
