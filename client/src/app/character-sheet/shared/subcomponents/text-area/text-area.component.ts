import { Component, Input, ViewChild } from '@angular/core';
import { SubComponentChild } from '../sub-component-child';
import { Aspect } from '../../aspect';
import { MatMenu } from '@angular/material';

@Component({
	selector: 'characterMaker-textArea',
	templateUrl: 'text-area.component.html',
	styleUrls: ['text-area.component.scss']
})
export class TextAreaComponent implements SubComponentChild {
	@Input() aspect: Aspect;
	@ViewChild('options', {static: true}) options: MatMenu;
	label: string;
	required: boolean;
	hasOptions = true;
	value: any;

	constructor() {

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

	setValue(value: any): any {
		this.value = value;
	}
}
