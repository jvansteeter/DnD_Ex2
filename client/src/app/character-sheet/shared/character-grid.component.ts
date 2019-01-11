import { Component, OnInit } from '@angular/core';
import { CharacterInterfaceFactory } from './character-interface.factory';
import { CharacterInterfaceService } from './character-interface.service';

@Component({
	selector: 'character-grid',
	templateUrl: 'character-grid.component.html',
	styleUrls: ['character-grid.component.scss']
})
export class CharacterGridComponent implements OnInit {
	public characterService: CharacterInterfaceService;

	constructor(private characterServiceFactory: CharacterInterfaceFactory) {
	}

	public ngOnInit(): void {
		this.characterService = this.characterServiceFactory.getCharacterInterface();
	}
}