import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Aspect } from '../../aspect';
import { SubComponentChild } from '../sub-component-child';
import { MatMenu } from '@angular/material';
import { CharacterInterfaceService } from '../../character-interface.service';
import { CharacterInterfaceFactory } from '../../character-interface.factory';

@Component({
	selector: 'characterMaker-numberComponent',
	templateUrl: 'number.component.html',
	styleUrls: ['number.component.scss']
})
export class NumberComponent implements SubComponentChild {
	@Input() aspect: Aspect;
	@ViewChild('options') options: MatMenu;
	@ViewChild('fontSizeInput') fontSizeInput: ElementRef;
	label: string;
	required: boolean;
	readonly hasOptions = false;
	value: any;

	private characterService: CharacterInterfaceService;

	constructor(characterInterfaceFactory: CharacterInterfaceFactory) {
		this.characterService = characterInterfaceFactory.getCharacterInterface();
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

	valueChanged(): void {
		this.characterService.updateFunctionAspects();
	}
}
