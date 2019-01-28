import { Component, Input, ViewChild } from '@angular/core';
import { SubComponentChild } from '../sub-component-child';
import { Aspect } from '../../aspect';
import { MatMenu } from '@angular/material';
import { ConditionData } from '../../../../../../../shared/types/rule-set/condition.data';
import { RuleSetService } from '../../../../data-services/ruleSet.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { isUndefined } from 'util';

@Component({
	selector: 'aspect-conditions',
	templateUrl: 'conditions.component.html',
	styleUrls: ['conditions.component.scss']
})
export class ConditionsComponent implements SubComponentChild {
	@Input() aspect: Aspect;
	@ViewChild('options') options: MatMenu;
	readonly hasOptions: boolean = true;

	conditions: ConditionData[] = [];
	autoCompleteControl = new FormControl();
	filteredConditions: Observable<ConditionData[]>;

	constructor(public ruleSetService: RuleSetService) {
		this.filteredConditions = this.autoCompleteControl.valueChanges.pipe(
				startWith(''),
				map((conditionName: string) => {
					return this.filterConditions(conditionName);
				}));
	}

	getMenuOptions(): MatMenu {
		return this.options;
	}

	getValue(): ConditionData[] {
		return this.conditions;
	}

	setValue(value: ConditionData[]): void {
		if (isUndefined(value)) {
			this.conditions = [];
		}
		else {
			this.conditions = value;
		}
	}

	stopClickPropagate(event): void {
		event.stopPropagation();
	}

	public addCondition(name: string): void {
		for (let condition of this.ruleSetService.conditions) {
			if (name.toLowerCase() === condition.name.toLowerCase()) {
				this.conditions.push(condition);
				this.autoCompleteControl.setValue('');
				return;
			}
		}
	}

	public removeCondition(index: number): void {
		this.conditions.splice(index, 1);
	}

	private filterConditions(value: string): ConditionData[] {
		if (isUndefined(value)) {
			value = '';
		}
		const filterValue = value.toLowerCase();
		return this.ruleSetService.conditions.filter((condition: ConditionData) => {
			return (condition.name.toLowerCase().indexOf(filterValue) === 0 &&
					!this.containsCondition(condition));
		});
	}

	private containsCondition(condition: ConditionData): boolean {
		for (let existingCondition of this.conditions) {
			if (condition.name.toLowerCase() === existingCondition.name.toLowerCase()) {
				return true;
			}
		}

		return false;
	}
}
