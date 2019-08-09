import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { RuleSetService } from '../../../data-services/ruleSet.service';
import { RulesConfigService } from '../../../data-services/rules-config.service';
import { DamageTypeData } from "../../../../../../shared/types/rule-set/damage-type.data";
import {
	AbstractControl,
	FormArray,
	FormBuilder,
	FormGroup,
	ValidationErrors,
	ValidatorFn,
	Validators
} from "@angular/forms";
import { isNullOrUndefined, isUndefined } from "util";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DamageData } from '../../../../../../shared/types/rule-set/damage.data';

@Component({
	templateUrl: 'submit-damage-dialog.component.html',
	styleUrls: ['submit-damage-dialog.component.scss']
})
export class SubmitDamageDialogComponent implements OnInit {
	public submitForm: FormGroup;
	public filteredDamageTypes: Observable<DamageTypeData[]>[];

	constructor(private dialogRef: MatDialogRef<SubmitDamageDialogComponent>,
	            public ruleSetService: RuleSetService,
	            private fb: FormBuilder,
	            public rulesConfigService: RulesConfigService) {
	}

	public ngOnInit(): void {
		this.submitForm = this.fb.group({
			amounts: this.fb.array([]),
			types: this.fb.array([]),
		});
		this.filteredDamageTypes = [];
		this.addDamageRow();
	}

	get amounts(): FormArray {
		return this.submitForm.get('amounts') as FormArray;
	}

	get types(): FormArray {
		return this.submitForm.get('types') as FormArray;
	}

	public selectDamageType(type: DamageTypeData, index: number): void {
		this.types.at(index).setValue(type.name);
	}

	public addDamageRow(): void {
		this.amounts.push(this.fb.control('', this.amountValidation));
		const control = this.fb.control('', this.typeValidation());
		this.filteredDamageTypes.push(control.valueChanges.pipe(
				startWith(''),
				map((typeName: string) => {
					if (typeof typeName !== 'string') {
						return [];
					}
					return this.filterDamageTypes(typeName);
				})
		));
		this.types.push(control);
	}

	public removeDamageRow(): void {
		const index = this.amounts.length - 1;
		this.amounts.removeAt(index);
		this.types.removeAt(index);
		this.filteredDamageTypes.splice(index, 1);
	}

	public submit(): void {
		if (this.submitForm.valid) {
			const damages: DamageData[] = [];
			for (let i = 0; i < this.amounts.length; i++) {
				const damage: DamageData = {
					amount: this.amounts.at(i).value,
					type: this.ruleSetService.damageTypes.find((type: DamageTypeData) => this.types.at(i).value === type.name)
				};
				damages.push(damage);
			}
			this.dialogRef.close(damages);
		}
	}

	private filterDamageTypes(value: string): DamageTypeData[] {
		if (isUndefined(value)) {
			value = '';
		}
		const filterValue: string = value.trim().toLowerCase();
		return this.ruleSetService.damageTypes.filter((type: DamageTypeData) => {
			return (type.name.trim().toLowerCase().includes(filterValue));
		});
	}

	private amountValidation = (control: AbstractControl): ValidationErrors | null => {
		if (Number(control.value) === 0) {
			return {
				'0': 'amount cannot be zero'
			}
		}

		return null;
	};

	private typeValidation(): ValidatorFn[] {
		const valFunctions: ValidatorFn[] = [];
		if (this.rulesConfigService.damageMustBeTyped) {
			valFunctions.push(Validators.required);
		}
		const validType: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
			if (!this.rulesConfigService.damageMustBeTyped && (isNullOrUndefined(control.value) || control.value === '')) {
				return null;
			}
			const type: DamageTypeData = this.ruleSetService.damageTypes.find((type: DamageTypeData) => type.name === control.value);
			if (isUndefined(type)) {
				return {
					'invalid type': 'not a valid damage type'
				}
			}
			return null;
		};
		valFunctions.push(validType);

		return valFunctions;
	}
}
