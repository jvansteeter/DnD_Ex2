import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharacterSheetRepository } from '../../repositories/character-sheet.repository';
import { CharacterSheetService } from './character-sheet.service';
import { CharacterInterfaceFactory } from '../shared/character-interface.factory';
import { CharacterData } from '../../../../../shared/types/character.data';
import { CharacterRepository } from '../../repositories/character.repository';
import { TokenComponent } from '../shared/subcomponents/token/token.component';
import { MatDialog } from '@angular/material';
import { AddAbilityDialogComponent } from '../../abilities/add-ability-dialog.component';
import { AbilityData } from "../../../../../shared/types/ability.data";

@Component({
	selector: 'character-sheet',
	templateUrl: 'character-sheet.component.html',
	styleUrls: ['character-sheet.component.scss']
})
export class CharacterSheetComponent implements OnInit {
	private npcId: string;

	@ViewChild(TokenComponent, {static: true})
	tokenComponent: TokenComponent;

	constructor(private activatedRoute: ActivatedRoute,
	            private characterSheetRepository: CharacterSheetRepository,
	            public characterService: CharacterSheetService,
	            private characterInterfaceFactory: CharacterInterfaceFactory,
	            private characterRepo: CharacterRepository,
	            private dialog: MatDialog) {
		this.characterService.init();
		this.characterInterfaceFactory.setCharacterInterface(this.characterService);
	}

	public ngOnInit(): void {
		this.characterService.init();
		this.activatedRoute.params.subscribe((params) => {
			this.npcId = params['characterId'];
			this.characterRepo.getCharacter(this.npcId).subscribe((characterData: CharacterData) => {
				this.tokenComponent.setTokens(characterData.tokens);
				this.characterService.setCharacterData(characterData);
			});
		});
	}

	public save(): void {
		this.characterService.setTokens(this.tokenComponent.getTokens());
		this.characterService.save();
	}

	public openAddAbilityDialog(): void {
		this.dialog.open(AddAbilityDialogComponent).afterClosed().subscribe((result: AbilityData) => {
			console.log(result);
		});
	}
}
