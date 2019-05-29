import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharacterSheetRepository } from '../../repositories/character-sheet.repository';
import { CharacterSheetService } from './character-sheet.service';
import { CharacterInterfaceFactory } from '../shared/character-interface.factory';
import { CharacterData } from '../../../../../shared/types/character.data';
import { CharacterRepository } from '../../repositories/character.repository';
import { TokenComponent } from '../shared/subcomponents/token/token.component';

@Component({
	selector: 'character-sheet',
	templateUrl: 'character-sheet.component.html',
	styleUrls: ['character-sheet.component.scss']
})
export class CharacterSheetComponent implements OnInit {
	private npcId: string;

	@ViewChild(TokenComponent, {static: false})
	tokenComponent: TokenComponent;

	constructor(private activatedRoute: ActivatedRoute,
	            private characterSheetRepository: CharacterSheetRepository,
	            public characterService: CharacterSheetService,
	            private characterInterfaceFactory: CharacterInterfaceFactory,
	            private characterRepo: CharacterRepository) {
		this.characterService.init();
		this.characterInterfaceFactory.setCharacterInterface(this.characterService);
	}

	ngOnInit(): void {
		this.characterService.init();
		this.activatedRoute.params.subscribe((params) => {
			this.npcId = params['characterId'];
			this.characterRepo.getCharacter(this.npcId).subscribe((characterData: CharacterData) => {
				this.tokenComponent.setTokenUrl(characterData.tokenUrl);
				this.characterService.setCharacterData(characterData);
			});
		});
	}

	save(): void {
		this.characterService.setTokenUrl(this.tokenComponent.getTokenUrl());
		this.characterService.save();
	}
}
