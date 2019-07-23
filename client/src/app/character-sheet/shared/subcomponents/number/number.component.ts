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

	private characterService: CharacterInterfaceService;
	private modifiersChangeSub: Subscription;

	constructor(characterInterfaceFactory: CharacterInterfaceFactory) {
		this.characterService = characterInterfaceFactory.getCharacterInterface();
	}

	ngOnInit(): void {
		this.setEffectiveValue();
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
		return this.value;
	}

	setValue(value: any): any {
		this.value = value;
	}

	valueChanged(value: number): void {
		this.value = value;
		this.characterService.updateFunctionAspects();
	}

	private setEffectiveValue(): void {
		const mod = this.characterService.getRuleModifiers(this.aspect);
		if (isDefined(mod)) {
			this.effectiveValue = this.value + Number(mod);
		}
		else {
			this.effectiveValue = this.value;
		}
	}
}
