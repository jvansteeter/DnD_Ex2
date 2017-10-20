import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AddComponentComponent } from './dialog/add-component.component';
import { CharacterMakerService } from './character-maker.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CharacterInterfaceFactory } from '../shared/character-interface.factory';


@Component({
    selector: 'character-maker',
    templateUrl: 'character-maker.component.html',
    styleUrls: ['../shared/character-sheet.css']
})
export class CharacterMakerComponent implements AfterViewInit {
    @ViewChild('characterSheet') characterSheet: ElementRef;

    readonly characterSheetHeightMin: number = 42;

    private characterSheetId: string;
    private characterSheetData: any;

    @HostListener('window:resize')
    onResize(): void {
        this.characterService.setWidth(this.characterSheet.nativeElement.offsetWidth);
    }

    constructor(private dialog: MatDialog,
                private activatedRoute: ActivatedRoute,
                private http: HttpClient,
                private characterInterfaceFactory: CharacterInterfaceFactory,
                public characterService: CharacterMakerService) {
        this.characterInterfaceFactory.setCharacterInterface(this.characterService);
    }

    ngAfterViewInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.characterSheetId = params['characterSheetId'];
            this.http.get('/api/ruleset/charactersheet/' + this.characterSheetId, {responseType: 'json'}).subscribe((data: any) => {
                this.characterSheetData = data;
                this.characterService.setCharacterSheetId(this.characterSheetId);
                this.characterService.initAspects(data.aspects);
            });
        });
        this.characterService.setWidth(this.characterSheet.nativeElement.offsetWidth);
        // this.characterService.onAddComponent((aspect) => this.addComponent(aspect));
        this.characterService.onChangeHeight((newHeight) => {
            this.characterSheet.nativeElement.style.height = (this.characterSheetHeightMin + newHeight) + 'px';
        });
    }

    public openAddDialog(): void {
        this.dialog.open(AddComponentComponent)
    }

    public save(): void {
        this.characterService.save();
    }
}
