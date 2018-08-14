import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharacterSheetRepository } from '../../repositories/character-sheet.repository';
import { CharacterSheetService } from './character-sheet.service';
import { CharacterInterfaceFactory } from '../shared/character-interface.factory';
import { CharacterData } from '../../../../../shared/types/character.data';
import { CharacterRepository } from '../../repositories/character.repository';

@Component({
	selector: 'character-sheet',
	templateUrl: 'character-sheet.component.html',
	styleUrls: ['../shared/character-sheet.scss', 'character-sheet.component.scss']
})
export class CharacterSheetComponent implements OnInit {
	private npcId: string;

	constructor(private activatedRoute: ActivatedRoute,
	            private characterSheetRepository: CharacterSheetRepository,
	            public characterService: CharacterSheetService,
	            private characterInterfaceFactory: CharacterInterfaceFactory,
	            private characterRepo: CharacterRepository) {
		this.characterInterfaceFactory.setCharacterInterface(this.characterService);
	}

	ngOnInit(): void {
		this.characterService.init();
		this.activatedRoute.params.subscribe((params) => {
			this.npcId = params['npcId'];
			this.characterRepo.getCharacter(this.npcId).subscribe((npcData: CharacterData) => {
				this.characterService.setCharacterData(npcData);
			});
		});
	}

	save(): void {
		this.characterService.save();
	}
}

