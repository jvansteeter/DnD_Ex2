import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharacterSheetRepository } from '../../repositories/character-sheet.repository';
import { CharacterSheetService } from './character-sheet.service';
import { CharacterInterfaceFactory } from '../shared/character-interface.factory';
import { CharacterData } from '../../../../../shared/types/character.data';

@Component({
	selector: 'character-sheet',
	templateUrl: 'character-sheet.component.html',
	styleUrls: ['../shared/character-sheet.scss', 'character-sheet.component.scss']
})
export class CharacterSheetComponent implements OnInit {
	private npcId: string;
	private npcData: CharacterData;

	constructor(private activatedRoute: ActivatedRoute,
	            private characterSheetRepository: CharacterSheetRepository,
	            public characterService: CharacterSheetService,
	            private characterInterfaceFactory: CharacterInterfaceFactory) {
		this.characterInterfaceFactory.setCharacterInterface(this.characterService);
	}

	ngOnInit(): void {
		this.characterService.init();
		this.activatedRoute.params.subscribe((params) => {
			this.npcId = params['npcId'];
			this.characterSheetRepository.getNpc(this.npcId).subscribe((npcData: CharacterData) => {
				this.npcData = npcData;
				if (npcData.characterSheet.aspects) {

				}
			});
		});
	}

	save(): void {
		this.npcData.values = [];
		for (let i = 0; i < this.characterService.aspects.length; i++) {
			let aspect = this.characterService.aspects[i];
			let value = {
				key: aspect._id,
				value: this.characterService.valueOfAspect(aspect)
			};
			this.npcData.values.push(value);
		}
		this.characterSheetRepository.saveNpc(this.npcData).subscribe();
	}
}

