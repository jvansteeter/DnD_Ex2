import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Aspect } from '../../aspect';
import { SubComponentChild } from '../sub-component-child';
import { MatMenu } from '@angular/material';
import { CharacterInterfaceService } from '../../character-interface.service';
import { CharacterInterfaceFactory } from '../../character-interface.factory';
import { isUndefined } from 'util';

@Component({
	selector:  'characterMaker-currentMax',
	templateUrl: 'current-max.component.html',
	styleUrls: ['current-max.component.scss']
})
export class CurrentMaxComponent implements SubComponentChild {
	@Input() aspect: Aspect;
	@ViewChild('options') options: MatMenu;
	@ViewChild('fontSizeInput') fontSizeInput: ElementRef;
	label: string;
	required: boolean;
	readonly hasOptions = false;
	value: {
		current: number,
		max: number
	};

	private characterService: CharacterInterfaceService;

	constructor(characterInterfaceFactory: CharacterInterfaceFactory) {
		this.characterService = characterInterfaceFactory.getCharacterInterface();
		this.value = {
			current: 0,
			max: 0
		}
	}

	getMenuOptions(): MatMenu {
		return this.options;
	}

	getValue() {
		return this.value;
	}

	setValue(value: any): any {
		if (!isUndefined(value)) {
			this.value = value;
		}
	}

	valueChanged(): void {
		this.characterService.updateFunctionAspects();
	}
}
