import {
	AfterViewInit,
	Component,
	Input,
	ViewChild
} from '@angular/core';
import { Aspect, AspectType } from './aspect';
import { CharacterInterfaceService } from './character-interface.service';
import { CharacterInterfaceFactory } from './character-interface.factory';
import { SubComponentChild } from './subcomponents/sub-component-child';
import { MatMenu } from '@angular/material';

@Component({
	selector: 'character-aspect',
	templateUrl: 'character-aspect.component.html',
	styleUrls: ['character-aspect.component.scss']
})
export class CharacterAspectComponent implements AfterViewInit {
	@Input('aspect') aspect: Aspect;
	@ViewChild('child', {static: true}) child: SubComponentChild;
	options: MatMenu;
	aspectType = AspectType;
	optionsOpen: boolean = false;
	hasOptions: boolean = false;
	public characterService: CharacterInterfaceService;


	constructor (
			characterInterfaceFactory: CharacterInterfaceFactory
	) {
		this.characterService = characterInterfaceFactory.getCharacterInterface();
	}

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.characterService.registerAspectComponent(this);
			this.options = this.child.getMenuOptions();
			this.hasOptions = this.child.hasOptions;
		});
	}

	getValue(): any {
		return this.child.getValue();
	}

	closeOptions(): void {
		this.optionsOpen = false;
	}

	public removeComponent(aspect: Aspect): void {
		this.characterService.removeComponent(aspect);
	}
}
