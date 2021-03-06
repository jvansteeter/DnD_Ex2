import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Aspect } from '../../aspect';
import { SubComponentChild } from '../sub-component-child';
import { CharacterMakerService } from '../../../maker/character-maker.service';
import { MatMenu } from '@angular/material';

export interface CategoryOption {
	value: string
}

@Component({
	selector: 'characterMaker-categoryComponent',
	templateUrl: 'category.component.html',
	styleUrls: ['category.component.scss']
})
export class CategoryComponent implements SubComponentChild, AfterViewInit {
	@Input() aspect: Aspect;
	@ViewChild('options', {static: true}) options: MatMenu;
	label: string;
	required: boolean;
	hasOptions = true;
	value: any;

	private categoryInput: string = '';
	private categoryToRemove: CategoryOption;

	private readonly categories: CategoryOption[];

	constructor(private characterMakerService: CharacterMakerService) {
		this.categories = [];
	}

	ngAfterViewInit(): void {
		if (this.aspect.hasOwnProperty('items') && this.aspect.items.length > 0) {
			for (let i = 0; i < this.aspect.items.length; i++) {
				this.categories.push({
					value: this.aspect.items[i].value
				});
			}
		}
	}

	addCategory(): void {
		if (this.categoryInput !== '') {
			this.categories.push({
				value: this.categoryInput
			});
			this.categoryInput = '';
		}
	}

	removeCategory(): void {
		if (this.categoryToRemove) {
			this.categories.splice(this.categories.indexOf(this.categoryToRemove), 1);
		}
	}

	getMenuOptions(): MatMenu {
		return this.options;
	}

	stopClickPropagate(event): void {
		event.stopPropagation();
	}

	closeMenu(): void {
		// this.options._emitCloseEvent();
	}

	getValue() {
		return this.value;
	}

	setValue(value: any): void {
		this.value = value;
	}

	getCategories(): CategoryOption[] {
		return this.categories;
	}

	valueChanged(): void {
		this.characterMakerService.updateFunctionAspects();
	}
}
