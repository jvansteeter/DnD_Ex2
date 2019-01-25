import { Component, Input, ViewChild } from '@angular/core';
import { SubComponentChild } from '../sub-component-child';
import { Aspect } from '../../aspect';
import { MatMenu } from '@angular/material';
import { ConditionData } from '../../../../../../../shared/types/rule-set/condition.data';
import { RuleSetService } from '../../../../data-services/ruleSet.service';

@Component({
	selector: 'aspect-conditions',
	templateUrl: 'conditions.component.html',
	styleUrls: ['conditions.component.scss']
})
export class ConditionsComponent implements SubComponentChild {
	@Input() aspect: Aspect;
	@ViewChild('options') options: MatMenu;
	readonly hasOptions: boolean = false;

	conditions: ConditionData[] = [];

	constructor(public ruleSetService: RuleSetService) {

	}

	getMenuOptions(): MatMenu {
		return this.options;
	}

	getValue(): ConditionData[] {

		return this.conditions;
	}

	setValue(value: ConditionData[]): void {
		this.conditions = value;
	}

	stopClickPropagate(event): void {
		event.stopPropagation();
	}

	public removeCondition(index: number): void {
		this.conditions.splice(index, 1);
	}
}
