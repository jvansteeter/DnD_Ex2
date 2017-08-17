import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MdDialog } from '@angular/material';
import { AddComponentComponent } from './dialog/add-component.component';
import { CharacterMakerService } from './character-maker.service';
import { Aspect, AspectType } from './aspect';


@Component({
    selector: 'character-maker',
    templateUrl: 'character-maker.component.html',
    styleUrls: ['character-maker.component.css']
})
export class CharacterMakerComponent implements AfterViewInit {
    @ViewChild('characterSheet') characterSheet: ElementRef;
    private aspectType = AspectType;
    // private aspects: Aspect[];

    @HostListener('window:resize')
    onResize(): void {
        this.characterMakerService.setWidth(this.characterSheet.nativeElement.offsetWidth);
    }

    constructor(private dialog: MdDialog,
                public characterMakerService: CharacterMakerService) {
        // this.aspects = [];
        this.characterMakerService.onAddComponent((aspect) => this.addComponent(aspect));
        this.characterMakerService.onRemoveComponent((aspect) => this.removeComponent(aspect));
    }

    ngAfterViewInit(): void {
        this.characterMakerService.setWidth(this.characterSheet.nativeElement.offsetWidth);
    }

    public openAddDialog(): void {
        this.dialog.open(AddComponentComponent)
    }

    public removeComponent(aspect: Aspect): void {
        this.characterMakerService.aspects.splice(this.characterMakerService.aspects.indexOf(aspect), 1);
    }

    private addComponent(aspect: Aspect): void {
        this.characterMakerService.aspects.push(aspect);
    }

    private reorder(): void {
        // let aspect = <Aspect>this.aspects.pop();
        // this.aspects.splice(0, 0, aspect);
        console.log(this.characterSheet.nativeElement.offsetWidth);
    }
}
