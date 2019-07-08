import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
	templateUrl: 'add-ability-dialog.component.html',
	styleUrls: ['add-ability-dialog.component.scss']
})
export class AddAbilityDialogComponent implements OnInit {
	public name: string = '';
	public rolls: {name: string, equation: string}[] = [];

	constructor(private dialogRef: MatDialogRef<AddAbilityDialogComponent>) {

	}

	public ngOnInit(): void {
		this.rolls.push({name: '', equation: ''});
	}

	public addRoll(): void {
		const lastRoll = this.rolls[this.rolls.length - 1];
		if (lastRoll.name === '' || lastRoll.equation === '') {
			return;
		}
		this.rolls.push({name: '', equation: ''});
	}

	public save(): void {
		if (this.name === '') {
			return;
		}
		for (let roll of this.rolls) {
			if (roll.name === '' || roll.equation === '') {
				return;
			}
		}

		this.dialogRef.close({
			name: this.name,
			rolls: this.rolls
		});
	}
}
