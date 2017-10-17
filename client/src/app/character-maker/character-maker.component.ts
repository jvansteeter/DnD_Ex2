import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AddComponentComponent } from './dialog/add-component.component';
import { CharacterMakerService } from './character-maker.service';
import { Aspect } from './aspect';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'character-maker',
    templateUrl: 'character-maker.component.html',
    styleUrls: ['character-maker.component.css']
})
export class CharacterMakerComponent implements AfterViewInit {
    @ViewChild('characterSheet') characterSheet: ElementRef;

    readonly characterSheetHeightMin: number = 42;

    private characterSheetId: string;
    private characterSheetData: any;

    @HostListener('window:resize')
    onResize(): void {
        this.characterMakerService.setWidth(this.characterSheet.nativeElement.offsetWidth);
    }

    constructor(private dialog: MatDialog,
                public characterMakerService: CharacterMakerService,
                private activatedRoute: ActivatedRoute,
                private http: HttpClient) {
    }

    ngAfterViewInit(): void {
        console.log('after view init')
        this.activatedRoute.params.subscribe(params => {
            this.characterSheetId = params['characterSheetId'];
            console.log('params')
            console.log(this.characterSheetId)
            this.http.get('/api/ruleset/charactersheet/' + this.characterSheetId, {responseType: 'json'}).subscribe((data: any) => {
                console.log('character sheet data')
                console.log(data)
                this.characterSheetData = data;
                this.characterMakerService.setCharacterSheetId(this.characterSheetId);
                this.characterMakerService.initAspects(data.aspects);
            });
        });
        this.characterMakerService.setWidth(this.characterSheet.nativeElement.offsetWidth);
        // this.characterMakerService.onAddComponent((aspect) => this.addComponent(aspect));
        this.characterMakerService.onChangeHeight((newHeight) => {
            this.characterSheet.nativeElement.style.height = (this.characterSheetHeightMin + newHeight) + 'px';
        });
    }

    public openAddDialog(): void {
        this.dialog.open(AddComponentComponent)
    }

    public save(): void {
        this.characterMakerService.save();
    }
}
