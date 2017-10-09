import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MdDialog } from '@angular/material';
import { AddComponentComponent } from './dialog/add-component.component';
import { CharacterMakerService } from './character-maker.service';
import { Aspect, AspectType } from './aspect';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'character-maker',
    templateUrl: 'character-maker.component.html',
    styleUrls: ['character-maker.component.css']
})
export class CharacterMakerComponent implements AfterViewInit {
    @ViewChild('characterSheet') characterSheet: ElementRef;

    readonly characterSheetHeightMin: number = 42;

    @HostListener('window:resize')
    onResize(): void {
        this.characterMakerService.setWidth(this.characterSheet.nativeElement.offsetWidth);
    }

    constructor(private dialog: MdDialog,
                public characterMakerService: CharacterMakerService) {
    }

    ngAfterViewInit(): void {
        this.characterMakerService.setWidth(this.characterSheet.nativeElement.offsetWidth);
        this.characterMakerService.onAddComponent((aspect) => this.addComponent(aspect));
        this.characterMakerService.onChangeHeight((newHeight) => {
            this.characterSheet.nativeElement.style.height = (this.characterSheetHeightMin + newHeight) + 'px';
        })
    }

    public openAddDialog(): void {
        this.dialog.open(AddComponentComponent)
    }

    private addComponent(aspect: Aspect): void {
        this.characterMakerService.aspects.push(aspect);
    }

    private save(): void {
        this.characterMakerService.save();
    }
}
