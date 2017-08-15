import { Component } from '@angular/core';
import { MdDialog } from '@angular/material';
import { AddComponentComponent } from './dialog/add-component.component';
import { AddComponentService } from './add-component.service';
import { Aspect, AspectType } from './aspect';


@Component({
    selector: 'character-maker',
    templateUrl: 'character-maker.component.html',
    styleUrls: ['character-maker.component.css']
})
export class CharacterMakerComponent {
    private aspectType = AspectType;
    private childAspects: Aspect[];

    constructor(private dialog: MdDialog,
                private addComponentService: AddComponentService) {
        this.addComponentService.subscribe((aspect) => this.addComponent(aspect));
        this.childAspects = [];
    }

    public openAddDialog(): void {
        this.dialog.open(AddComponentComponent)
    }

    private addComponent(aspect: Aspect): void {
        if (aspect.aspectType === AspectType.text) {
            this.childAspects.push(aspect);
        }
    }
}
