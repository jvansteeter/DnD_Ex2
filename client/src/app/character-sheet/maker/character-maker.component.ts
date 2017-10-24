import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AddComponentComponent } from './dialog/add-component.component';
import { CharacterMakerService } from './character-maker.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CharacterInterfaceFactory } from '../shared/character-interface.factory';
import { NgGridConfig } from 'angular2-grid';
import { Aspect } from '../shared/aspect';


@Component({
    selector: 'character-maker',
    templateUrl: 'character-maker.component.html',
    styleUrls: ['../shared/character-sheet.css']
})
export class CharacterMakerComponent implements OnInit, AfterViewInit {
    @ViewChild('characterSheet') characterSheet: ElementRef;

    readonly characterSheetHeightMin: number = 42;

    private characterSheetId: string;
    private characterSheetData: any;
    public hoveredZIndex: number[] = [];

    public gridConfig: NgGridConfig = <NgGridConfig>{
        'margins': [5],
        'draggable': true,
        'resizable': true,
        'max_cols': 0,
        'max_rows': 0,
        'visible_cols': 0,
        'visible_rows': 0,
        'min_cols': 1,
        'min_rows': 1,
        'col_width': 2,
        'row_height': 2,
        'cascade': 'up',
        'min_width': 20,
        'min_height': 20,
        'fix_to_grid': true,
        'auto_style': true,
        'auto_resize': false,
        'maintain_ratio': false,
        'prefer_new': false,
        'zoom_on_drag': false,
        'limit_to_screen': true,
        'element_based_row_height': false,
        'center_to_screen': false,
    };

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



    ngOnInit(): void {
        this.characterService.init();
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
        // this.characterService.setWidth(this.characterSheet.nativeElement.offsetWidth);
        // this.characterService.onAddComponent((aspect) => this.addComponent(aspect));
        // this.characterService.onChangeHeight((newHeight) => {
        //     this.characterSheet.nativeElement.style.height = (this.characterSheetHeightMin + newHeight) + 'px';
        // });
    }

    public openAddDialog(): void {
        this.dialog.open(AddComponentComponent)
    }

    public save(): void {
        this.characterService.save();
    }


    hoverStart(index: number): void {
        this.hoveredZIndex[index] = 2;
    }

    hoverEnd(index: number): void {
        this.hoveredZIndex[index] = 0;
    }
}
