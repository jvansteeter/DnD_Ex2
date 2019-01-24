import { Component } from '@angular/core';
import { ConditionData } from '../../../../../../shared/types/rule-set/condition.data';
import { MatDialogRef } from '@angular/material';

@Component({
	templateUrl: 'new-condition-dialog.component.html',
	styleUrls: ['new-condition-dialog.component.scss']
})
export class NewConditionDialogComponent {
	public condition: ConditionData = {
		name: '',
		description: '',
		icon: '',
		color: '',
	};
	public iconOptions: string[];

	constructor(private matDialogRef: MatDialogRef<NewConditionDialogComponent>) {
		this.iconOptions = [
			'account_balance',
			'account_circle',
			'account_box',
			'all_out',
			'visibility',
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
	}

	public selectIcon(icon: string): void {
		this.condition.icon = icon;
	}

	public submit(): void {
		if (this.condition.name !== '' && this.condition.description !== '' && this.condition.icon !== '' && this.condition.color !== '') {
			this.matDialogRef.close(this.condition);
		}
	}
}