import { Aspect, AspectType } from '../../../types/character-sheet/aspect';
import {
	AfterViewInit, Component, Input, OnInit,
	ViewChild,
} from '@angular/core';
import { SubComponentChild } from './sub-component-child';
import { MatMenu } from '@angular/material';
import { CharacterInterfaceService } from '../character-interface.service';
import { CharacterInterfaceFactory } from '../character-interface.factory';

@Component({
	selector: 'sub-component',
	templateUrl: 'sub-component.html',
	styleUrls: ['sub-component.scss']
})
export class SubComponent implements OnInit, AfterViewInit {
	@Input() aspect: Aspect;
	@ViewChild('child') child: SubComponentChild;
	options: MatMenu;
	aspectType = AspectType;
	optionsOpen: boolean = false;
	hasOptions: boolean = false;
	private characterService: CharacterInterfaceService;

	constructor(characterInterfaceFactory: CharacterInterfaceFactory) {
		this.characterService = characterInterfaceFactory.getCharacterInterface();
	}

	ngOnInit(): void {
	}

	ngAfterViewInit(): void {
		this.options = this.child.getMenuOptions();
		setTimeout(() => this.characterService.registerSubComponent(this));
		this.hasOptions = this.child.hasOptions;
	}

	getValue(): any {
		return this.child.getValue();
	}

	closeOptions(): void {
		this.optionsOpen = false;
	}
}