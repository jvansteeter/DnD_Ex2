import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharacterSheetRepository } from './character-sheet.repository';
import { CharacterSheetService } from './character-sheet.service';
import { CharacterInterfaceFactory } from '../shared/character-interface.factory';
import { Observable } from 'rxjs/Observable';


@Component({
    selector: 'character-sheet',
    templateUrl: 'character-sheet.component.html',
    styleUrls: ['../shared/character-sheet.css']
})
export class CharacterSheetComponent implements OnInit, AfterViewInit {
    private npcId: string;
    private characterSheet: any;
    @ViewChild('characterSheet') private characterSheetElement: ElementRef;

    readonly characterSheetHeightMin: number = 42;

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
            this.characterSheetRepository.getNpc(this.npcId).subscribe((npcData) => {
                this.characterSheet = npcData.characterSheet;
                if (npcData.characterSheet.aspects) {
                    this.characterSheetService.setAspects(npcData.characterSheet.aspects);
                }
            });
        });
    }

    ngAfterViewInit(): void {
        Observable.timer(100).subscribe(() => {
            this.characterSheetElement.nativeElement.style.height = (this.characterSheet.height + this.characterSheetHeightMin) + 'px';
        });
    }
}

