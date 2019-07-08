import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AddAbilityDialogComponent } from './add-ability-dialog.component';
import { AbilityData } from '../../../../shared/types/ability.data';
import { isDefined } from '@angular/compiler/src/util';
import { MatAccordionDisplayMode, MatDialog } from '@angular/material';
import { AbilityService } from './ability.service';
import { EncounterKeyEventService } from '../encounter/encounter-key-event.service';
import { isNullOrUndefined } from 'util';

@Component({
	selector: 'character-abilities',
	templateUrl: 'abilities.component.html',
	styleUrls: ['abilities.component.scss']
})
export class AbilitiesComponent implements OnInit {
	@Input()
	public abilities: AbilityData[];

	@Output()
	public change = new EventEmitter();

	public displayMode: MatAccordionDisplayMode = 'flat';
	public expandedIndex: number = -1;

	constructor(private dialog: MatDialog,
	            private keyEventService: EncounterKeyEventService,
	            private abilityService: AbilityService) {

	}

	public ngOnInit(): void {
		for (let ability of this.abilities) {
			for (let roll of ability.rolls) {
				if (isNullOrUndefined(roll.result)) {
					roll.result = '-';
				}
			}
		}
	}

	public openAddAbilityDialog(): void {
		this.keyEventService.stopListeningToKeyEvents();
		this.dialog.open(AddAbilityDialogComponent).afterClosed().subscribe((result: AbilityData) => {
			if (isDefined(result)) {
				for (let roll of result.rolls) {
					roll.result = '-';
				}
				this.abilities.push(result);
				this.change.emit();
			}
			this.keyEventService.startListeningToKeyEvents();
		});
	}

	public editAbility(index: number): void {
		this.keyEventService.stopListeningToKeyEvents();
		this.dialog.open(AddAbilityDialogComponent, {data: this.abilities[index]})
				.afterClosed()
				.subscribe((result: AbilityData) => {
					if (isDefined(result)) {
						this.abilities.splice(index, 1, result);
						this.keyEventService.startListeningToKeyEvents();
						this.change.emit();
					}
				});
	}

	public removeAbility(index: number): void {
		this.abilities.splice(index, 1);
		this.change.emit();
	}

	public rollAbility(ability: AbilityData) {
		for (let roll of ability.rolls) {
			roll.result = this.abilityService.evaluationValueOfRollEquation(roll.equation);
		}

		this.change.emit();
	}

	public expanded(index: number): void {
		this.expandedIndex = index;
	}
}
