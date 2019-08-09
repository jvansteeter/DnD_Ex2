import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DamageTypeData } from '../../../../../../shared/types/rule-set/damage-type.data';
import { IconList } from '../../../utilities/icon-list';

@Component({
	templateUrl: 'new-damage-type-dialog.component.html',
	styleUrls: ['new-damage-type-dialog.component.scss']
})
export class NewDamageTypeDialogComponent {
	public damageType: DamageTypeData = {
		name: '',
		color: '',
		icon: '',
	};
	public iconOptions: string[];

	constructor(private matDialogRef: MatDialogRef<NewDamageTypeDialogComponent>) {
		this.iconOptions = IconList;
	}

	public selectIcon(icon: string): void {
		this.damageType.icon = icon;
	}

	public submit(): void {
		if (this.damageType.color !== '' && this.damageType.name !== '' && this.damageType.icon !== '') {
			this.matDialogRef.close(this.damageType);
		}
	}
}