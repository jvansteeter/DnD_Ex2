import { Component } from '@angular/core';
import { CharacterMakerService } from '../maker/character-maker.service';

@Component({
	selector: 'character-grid',
	templateUrl: 'character-grid.component.html',
	styleUrls: ['character-grid.component.scss', 'character-sheet.scss']
})
export class CharacterGridComponent {
	constructor(public characterService: CharacterMakerService) {

	}
}