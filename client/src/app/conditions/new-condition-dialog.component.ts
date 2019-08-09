import { Component, Inject } from '@angular/core';
import { ConditionData } from '../../../../shared/types/rule-set/condition.data';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { isDefined } from '@angular/compiler/src/util';
import { IconList } from '../utilities/icon-list';

@Component({
	templateUrl: 'new-condition-dialog.component.html',
	styleUrls: ['new-condition-dialog.component.scss']
})
export class NewConditionDialogComponent {
	public condition: ConditionData = {
		name: '',
		description: '',
		icon: '',
		color: 'black',
	};
	public iconOptions: string[];

	constructor(private matDialogRef: MatDialogRef<NewConditionDialogComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
		if (isDefined(data)) {
			this.condition = data.condition;
		}
		this.iconOptions = IconList;
	}

	public selectIcon(icon: string): void {
		this.condition.icon = icon;
	}

	public submit(): void {
		if (this.condition.name !== '' && this.condition.icon !== '' && this.condition.color !== '') {
			this.matDialogRef.close(this.condition);
		}
	}
}