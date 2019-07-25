import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Aspect } from '../../aspect';
import { SubComponentChild } from '../sub-component-child';
import { MatMenu } from '@angular/material';
import { CharacterInterfaceService } from '../../character-interface.service';
import { CharacterInterfaceFactory } from '../../character-interface.factory';
import { Subscription } from 'rxjs';
import { isDefined } from '@angular/compiler/src/util';

@Component({
	selector: 'characterMaker-numberComponent',
	templateUrl: 'number.component.html',
	styleUrls: ['number.component.scss']
})
export class NumberComponent implements SubComponentChild, OnInit, OnDestroy {
	@Input() aspect: Aspect;
	@ViewChild('options', {static: true}) options: MatMenu;
	@ViewChild('fontSizeInput', {static: true}) fontSizeInput: ElementRef;
	label: string;
	required: boolean;
	readonly hasOptions = false;
	value: any;
	effectiveValue: number;
	displayValue: number;
	fontColor: string = 'black';

	private characterService: CharacterInterfaceService;
	private modifiersChangeSub: Subscription;

	constructor(characterInterfaceFactory: CharacterInterfaceFactory) {
		this.characterService = characterInterfaceFactory.getCharacterInterface();
	}

	ngOnInit(): void {
		this.modifiersChangeSub = this.characterService.modifiersChangeObservable.subscribe(() => {
			this.setEffectiveValue();
		});
	}

	ngOnDestroy(): void {
		if (this.modifiersChangeSub) {
			this.modifiersChangeSub.unsubscribe();
		}
	}

	getMenuOptions(): MatMenu {
		return this.options;
	}

	getValue() {
		return Number(this.value);
	}

	setValue(value: any): any {
		this.value = value;
		this.setEffectiveValue();
		this.displayValue = this.effectiveValue;
	}

	valueChanged(value: number): void {
		this.value = value;
		this.characterService.updateFunctionAspects();
		this.setEffectiveValue();
	}

	setToValue(): void {
		this.displayValue = this.value;
		this.fontColor = 'black';
	}

	setToEffectiveValue(): void {
		this.displayValue = this.effectiveValue;
		if (this.effectiveValue > this.value) {
			this.fontColor = 'blue';
		}
	}

	private setEffectiveValue(): void {
		const mod: Map<string, number> = this.characterService.getRuleModifiers(this.aspect);
		let total: number = 0;
		for (let value of mod.values()) {
			total += Number(value);
		}

		if (isDefined(mod)) {
			this.effectiveValue = Number(this.value) + total;
			this.setToEffectiveValue();
		}
		else {
			this.effectiveValue = this.value;
		}
	}
}
