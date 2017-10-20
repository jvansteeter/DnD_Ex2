import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharacterSheetRepository } from './character-sheet.repository';
import { CharacterSheetService } from './character-sheet.service';
import { CharacterInterfaceFactory } from '../shared/character-interface.factory';


@Component({
    selector: 'character-sheet',
    templateUrl: 'character-sheet.component.html',
    styleUrls: ['../shared/character-sheet.css']
})
export class CharacterSheetComponent implements OnInit {
    private npcId: string;
    private characterSheet: any;

    constructor(private activatedRoute: ActivatedRoute,
                private characterSheetRepository: CharacterSheetRepository,
                private characterSheetService: CharacterSheetService,
                private characterInterfaceFactory: CharacterInterfaceFactory) {
        this.characterInterfaceFactory.setCharacterInterface(this.characterSheetService);
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.npcId = params['npcId'];
            this.characterSheetRepository.getNpc(this.npcId).subscribe((npcData) => {
                console.log('character sheet data')
                console.log(npcData)
                this.characterSheet = npcData.characterSheet;
            });
        });
    }
}

