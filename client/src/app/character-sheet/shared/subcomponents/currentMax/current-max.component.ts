import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Aspect } from '../../aspect';
import { SubComponentChild } from '../sub-component-child';
import { MatMenu } from '@angular/material';
import { CharacterInterfaceService } from '../../character-interface.service';
import { CharacterInterfaceFactory } from '../../character-interface.factory';
import { isUndefined } from 'util';
import { Subscription } from 'rxjs';
import { isDefined } from '@angular/compiler/src/util';

@Component({
	selector:  'characterMaker-currentMax',
	templateUrl: 'current-max.component.html',
	styleUrls: ['current-max.component.scss']
})
export class CurrentMaxComponent implements SubComponentChild, OnInit, OnDestroy {
	@Input() aspect: Aspect;
	@ViewChild('options', {static: true}) options: MatMenu;
	@ViewChild('fontSizeInput', {static: true}) fontSizeInput: ElementRef;
	label: string;
	required: boolean;
	public currentFontColor: string = 'black';
	public maxFontColor: string = 'black';
	readonly hasOptions = false;
	value: {
		current: number,
		max: number
	};
	effectiveValue: {
		current: number,
		max: number
	};
	displayValue: {
		current: number;
		max: number;
	};

	private characterService: CharacterInterfaceService;
	private modifiersChangeSub: Subscription;

	constructor(characterInterfaceFactory: CharacterInterfaceFactory) {
		this.characterService = characterInterfaceFactory.getCharacterInterface();
		this.value = {
			current: 0,
			max: 0
		};
		this.displayValue = this.value;
	}

	public ngOnInit(): void {
		this.setEffectiveValue();
		this.modifiersChangeSub = this.characterService.modifiersChangeObservable.subscribe(() => {
			this.setEffectiveValue();
		});
	}

	public ngOnDestroy(): void {
		if (this.modifiersChangeSub) {
			this.modifiersChangeSub.unsubscribe();
		}
	}

	getMenuOptions(): MatMenu {
		return this.options;
	}

	public setToValue(): void {
		this.displayValue = this.value;
		this.currentFontColor = 'black';
		this.maxFontColor = 'black';
	}

	public setToEffectiveValue(): void {
		this.displayValue = this.effectiveValue;
		if (this.effectiveValue.current > this.value.current) {
			this.currentFontColor = 'blue';
		}
		else {
			this.currentFontColor = 'black';
		}
		if (this.effectiveValue.max > this.value.max) {
			this.maxFontColor = 'blue';
		}
		else {
			this.currentFontColor = 'black';
		}
	}

	getValue() {
		return this.value;
	}

	setValue(value: any): any {
		if (!isUndefined(value)) {
			this.value = value;
		}
		this.setEffectiveValue();
		this.displayValue = this.effectiveValue;
	}

	public currentValueChanged(value: number): void {
		this.value.current = value;
		this.setEffectiveValue();
		this.characterService.updateFunctionAspects();
	}

	public maxValueChanged(value: number): void {
		this.value.max = value;
		this.setEffectiveValue();
		this.characterService.updateFunctionAspects();
	}

	private setEffectiveValue(): void {
		const mod: Map<string, any> = this.characterService.getRuleModifiers(this.aspect);
		let currentTotal: number = 0;
		let maxTotal: number = 0;
		for (const value of mod.values()) {
			currentTotal += Number(value.current);
			maxTotal += Number(value.max);
		}

		if (isDefined(mod)) {
			const effectiveCurrent: number = Number(this.value.current) + currentTotal;
			const effectiveMax: number = Number(this.value.max) + maxTotal;
			this.effectiveValue = {current: effectiveCurrent, max: effectiveMax};
			this.setToEffectiveValue();
		}
		else {
			this.effectiveValue = this.value;
		}
	}
}
