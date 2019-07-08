import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AbilityService } from './ability.service';
import { AlertService } from '../alert/alert.service';
import { isDefined } from '@angular/compiler/src/util';

@Component({
	templateUrl: 'add-ability-dialog.component.html',
	styleUrls: ['add-ability-dialog.component.scss']
})
export class AddAbilityDialogComponent implements OnInit {
	public name: string = '';
	public rolls: {name: string, equation: string}[] = [];

	constructor(@Inject(MAT_DIALOG_DATA) private data: any,
	            private dialogRef: MatDialogRef<AddAbilityDialogComponent>,
	            private abilityService: AbilityService,
	            private alertService: AlertService) {

	}

	public ngOnInit(): void {
		if (isDefined(this.data)) {
			this.name = this.data.name;
			this.rolls = this.data.rolls;
		}
		else {
			this.rolls.push({name: '', equation: ''});
		}
	}

	public addRoll(): void {
		const lastRoll = this.rolls[this.rolls.length - 1];
		if (lastRoll.name === '' || lastRoll.equation === '') {
			return;
		}
		this.rolls.push({name: '', equation: ''});
	}

	public removeRoll(): void {
		if (this.rolls.length === 1) {
			return;
		}
		this.rolls.splice(this.rolls.length - 1, 1);
	}

	public evaluateEquation(equation: string): void {
		const result = this.abilityService.evaluationValueOfRollEquation(equation);
		if (result === 'NaN') {
			this.alertService.showAlert('Invalid die equation')
		}
	}

	public save(): void {
		if (this.name === '') {
			this.alertService.showAlert('Please give the ability a name');
			return;
		}
		for (let roll of this.rolls) {
			if (roll.name === '' || roll.equation === '') {
				this.alertService.showAlert('Cannot have empty name or equation');
				return;
			}
			if (this.abilityService.evaluationValueOfRollEquation(roll.equation) === 'NaN') {
				this.alertService.showAlert('Invalid die equation');
				return;
			}
		}

		this.dialogRef.close({
			name: this.name,
			rolls: this.rolls
		});
	}
}
