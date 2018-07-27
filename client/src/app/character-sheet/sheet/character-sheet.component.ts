import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharacterSheetRepository } from '../shared/character-sheet.repository';
import { CharacterSheetService } from './character-sheet.service';
import { CharacterInterfaceFactory } from '../shared/character-interface.factory';
import { Npc } from '../../types/character-sheet/npc';


@Component({
    selector: 'character-sheet',
    templateUrl: 'character-sheet.component.html',
    styleUrls: ['../shared/character-sheet.scss']
})
export class CharacterSheetComponent implements OnInit {
    private npcId: string;
    private npcData: Npc;

    // public gridConfig: NgGridConfig = <NgGridConfig>{
    //     'margins': [5],
    //     'draggable': false,
    //     'resizable': false,
    //     'max_cols': 0,
    //     'max_rows': 0,
    //     'visible_cols': 0,
    //     'visible_rows': 0,
    //     'min_cols': 1,
    //     'min_rows': 1,
    //     'col_width': 2,
    //     'row_height': 2,
    //     'cascade': 'up',
    //     'min_width': 1,
    //     'min_height': 1,
    //     'fix_to_grid': true,
    //     'auto_style': true,
    //     'auto_resize': true,
    //     'maintain_ratio': false,
    //     'prefer_new': false,
    //     'zoom_on_drag': false,
    //     'limit_to_screen': false,
    //     'element_based_row_height': false,
    //     'center_to_screen': false,
    // };

    constructor(private activatedRoute: ActivatedRoute,
                private characterSheetRepository: CharacterSheetRepository,
                public characterSheetService: CharacterSheetService,
                private characterInterfaceFactory: CharacterInterfaceFactory) {
        this.characterInterfaceFactory.setCharacterInterface(this.characterSheetService);
    }

    ngOnInit(): void {
        this.characterSheetService.init();
        this.activatedRoute.params.subscribe((params) => {
            this.npcId = params['npcId'];
            this.characterSheetRepository.getNpc(this.npcId).subscribe((npcData: Npc) => {
                this.npcData = npcData;
                if (npcData.characterSheet.aspects) {
                    // this.gridConfig.max_cols = 0;
                    // for (let i = 0; i < npcData.characterSheet.aspects.length; i++) {
                    //     let currentAspect = npcData.characterSheet.aspects[i];
                    //     if (currentAspect.config.row === 1 && currentAspect.config.sizex) {
                    //         this.gridConfig.max_cols += currentAspect.config.sizex;
                    //     }
                    // }
                    // this.characterSheetService.populateCharacterData(npcData);
                }
            });
        });
    }

    save(): void {
        this.npcData.values = [];
        for (let i = 0; i < this.characterSheetService.aspects.length; i++) {
            let aspect = this.characterSheetService.aspects[i];
            let value = {
                key: aspect._id,
                value: this.characterSheetService.valueOfAspect(aspect)
            };
            this.npcData.values.push(value);
        }
        this.characterSheetRepository.saveNpc(this.npcData).subscribe();
    }
}

