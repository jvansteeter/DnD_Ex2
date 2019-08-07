import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SubComponentChild } from '../sub-component-child';
import { Aspect } from '../../aspect';
import { MatMenu } from '@angular/material';
import { ResistanceData } from '../../../../../../../shared/types/resistance.data';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DamageTypeData } from '../../../../../../../shared/types/rule-set/damage-type.data';
import { map, startWith } from 'rxjs/operators';
import { RuleSetService } from '../../../../data-services/ruleSet.service';
import { isUndefined } from 'util';

@Component({
	selector: 'resistances-aspect',
	templateUrl: 'resistances-aspect.component.html',
	styleUrls: ['resistances-aspect.component.scss']
})
export class ResistancesAspectComponent implements SubComponentChild, OnInit {
	@Input()
	aspect: Aspect;
	@ViewChild('options', {static: true})
	options: MatMenu;
	readonly hasOptions: boolean = true;

	public resistances: ResistanceData[] = [];
	public autoCompleteControl = new FormControl();
	public filteredDamageTypes: Observable<DamageTypeData[]>;

	constructor(private ruleSetService: RuleSetService) {

	}

	public ngOnInit(): void {
		this.filteredDamageTypes = this.autoCompleteControl.valueChanges.pipe(
				startWith(''),
				map((damageTypeName) => {
					if (typeof damageTypeName !== 'string') {
						return [];
					}
					return this.filterDamageTypes(damageTypeName);
				})
		);
	}

	getMenuOptions(): MatMenu {
		return this.options;
	}

	getValue(): any {
		return this.resistances;
	}

	setValue(value: ResistanceData[]): void {
		this.resistances = value;
	}

	public stopClickPropagate(event): void {
		event.stopPropagation();
	}

	public addResistance(type: DamageTypeData): void {
		this.autoCompleteControl.setValue('');
		this.resistances.push({damageType: type, percent: 0});
	}

	public removeResistance(index: number): void {
		this.resistances.splice(index, 1);
	}

	private filterDamageTypes(value: string): DamageTypeData[] {
		if (isUndefined(value)) {
			value = '';
		}
		const filterValue: string = value.trim().toLowerCase();
		return this.ruleSetService.damageTypes.filter((type: DamageTypeData) => {
			return (type.name.trim().toLowerCase().indexOf(filterValue) === 0 && !this.containsDamageType(type));
		});
	}

	private containsDamageType(type: DamageTypeData): boolean {
		for (const existingResistance of this.resistances) {
			if (existingResistance.damageType.name.trim().toLowerCase() === type.name.trim().toLowerCase()) {
				return true;
			}
		}

		return false;
	}
}
