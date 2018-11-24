import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { SubComponentChild } from '../sub-component-child';
import { Aspect } from '../../aspect';
import { MatMenu } from '@angular/material';
import { isUndefined } from "util";


interface TextItem {
	value: string
}

@Component({
	selector: 'characterMaker-textListComponent',
	templateUrl: 'text-list.component.html',
	styleUrls: ['text-list.component.scss']
})
export class TextListComponent implements SubComponentChild, AfterViewInit {
	@Input() aspect: Aspect;
	@ViewChild('options') options: MatMenu;
	label: string;
	required: boolean;
	readonly hasOptions = true;
	value: any;

	public items: TextItem[];

	constructor() {
		this.items = [];
	}

	ngAfterViewInit(): void {
		if (!isUndefined(this.aspect.items) && this.aspect.items.length > 0) {
			for (let i = 0; i < this.aspect.items.length; i++) {
				this.items.push({
					value: ''
				});
			}
		}
	}

	getMenuOptions(): MatMenu {
		return this.options;
	}

	addItem(): void {
		this.items.push({value: ''});
	}

	removeItem(): void {
		this.items.splice(this.items.length - 1, 1);
	}

	stopClickPropagate(event): void {
		event.stopPropagation();
	}

	getValue() {
		return this.items;
	}

	setValue(value: any): any {
		if (!isUndefined(value)) {
			this.items = value;
		}
	}
}

