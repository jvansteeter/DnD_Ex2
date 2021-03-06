import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { SubComponentChild } from '../sub-component-child';
import { Aspect } from '../../aspect';
import { MatMenu } from '@angular/material';
import { CharacterInterfaceFactory } from '../../character-interface.factory';
import { CharacterInterfaceService } from '../../character-interface.service';
import { isUndefined } from "util";

interface CheckboxItem {
	label: string;
	value: boolean;
}

@Component({
	selector: 'characterMaker-checkBoxListComponent',
	templateUrl: 'checkbox-list.component.html',
	styleUrls: ['checkbox-list.component.scss']
})
export class CheckboxListComponent implements SubComponentChild, AfterViewInit {
	@Input() aspect: Aspect;
	@ViewChild('options', {static: true}) options: MatMenu;
	label: string;
	required: boolean;
	readonly hasOptions = true;
	value: any;

	public checkboxes: CheckboxItem[];
	private characterService: CharacterInterfaceService;

	constructor(private characterInterfaceFactory: CharacterInterfaceFactory) {
		this.characterService = this.characterInterfaceFactory.getCharacterInterface();
		this.checkboxes = [];
	}

	ngAfterViewInit(): void {
		if (this.aspect.hasOwnProperty('items') && this.aspect.items.length > 0) {
			for (let i = 0; i < this.aspect.items.length; i++) {
				this.checkboxes.push({
					label: this.aspect.items[i],
					value: false
				});
			}
		}
	}

	getMenuOptions(): MatMenu {
		return this.options;
	}

	addCheckbox(): void {
		this.checkboxes.push({
			label: '',
			value: false
		});
	}

	removeCheckbox(): void {
		this.checkboxes.splice(this.checkboxes.length - 1, 1);
	}

	stopClickPropagate(event): void {
		event.stopPropagation();
	}

	valueChanged(): void {
		this.characterService.updateFunctionAspects();
	}

	getValue(): CheckboxItem[] {
		return this.checkboxes;
	}

	setValue(value: any): any {
		if (!isUndefined(value)) {
			this.checkboxes = value;
		}
	}

	getCheckboxLabels(): string[] {
		let labels: string[] = [];
		for (let i = 0; i < this.checkboxes.length; i++) {
			labels.push(this.checkboxes[i].label);
		}

		return labels;
	}
}

