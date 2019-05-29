import { Component, Input, ViewChild } from '@angular/core';
import { Aspect } from '../../aspect';
import { SubComponentChild } from '../sub-component-child';
import { MatMenu } from '@angular/material';

@Component({
	selector: 'characterMaker-textComponent',
	templateUrl: 'text.component.html',
	styleUrls: ['text.component.scss']
})
export class TextComponent implements SubComponentChild {
	@Input() aspect: Aspect;
	@ViewChild('options', {static: false}) options: MatMenu;
	label: string;
	required: boolean;
	readonly hasOptions = false;
	value: any;

	constructor() {

	}

	getMenuOptions(): MatMenu {
		return this.options;
	}

	getValue() {
		return this.value;
	}

	setValue(value: any): any {
		this.value = value;
	}
}
