import { Component } from '@angular/core';
import { MdDialog } from '@angular/material';
import { AddComponentComponent } from './dialog/add-component.component';
import { CharacterMakerService } from './character-maker.service';
import { Aspect, AspectType } from './aspect';


@Component({
    selector: 'character-maker',
    templateUrl: 'character-maker.component.html',
    styleUrls: ['character-maker.component.css']
})
export class CharacterMakerComponent {
    private aspectType = AspectType;
    private aspects: Aspect[];

    constructor(private dialog: MdDialog,
                private characterMakerService: CharacterMakerService) {
        this.aspects = [];
        this.characterMakerService.onAddComponent((aspect) => this.addComponent(aspect));
        this.characterMakerService.onRemoveComponent((aspect) => this.removeComponent(aspect));
    }

    public openAddDialog(): void {
        this.dialog.open(AddComponentComponent)
    }

    public removeComponent(aspect: Aspect): void {
        this.aspects.splice(this.aspects.indexOf(aspect));
    }

    private addComponent(aspect: Aspect): void {
        this.aspects.push(aspect);
    }
}
