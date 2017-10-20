import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharacterSheetRepository } from './character-sheet.repository';


@Component({
    selector: 'character-sheet',
    templateUrl: 'character-sheet.component.html',
    styleUrls: ['character-sheet.component.css']
})
export class CharacterSheetComponent implements OnInit {
    private npcId: string;
    private characterSheetData: any;

    constructor(private activatedRoute: ActivatedRoute,
                private characterSheetRepository: CharacterSheetRepository) {

    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.npcId = params['npcId'];
            this.characterSheetRepository.getNpc(this.npcId).subscribe((characterSheetData) => {
                console.log('character sheet data')
                console.log(characterSheetData)
                this.characterSheetData = characterSheetData;
            });
        });
    }
}

