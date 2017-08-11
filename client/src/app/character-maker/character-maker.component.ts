import { Component } from '@angular/core';
import { MdDialog } from '@angular/material';
import { AddComponentComponent } from './dialog/add-component.component';
import { AddComponentService } from './add-component.service';
import { Aspect } from './aspect';


@Component({
    selector: 'character-maker',
    templateUrl: 'character-maker.component.html',
    styleUrls: ['character-maker.component.css']
})
export class CharacterMakerComponent {
    constructor(private dialog: MdDialog,
                private addComponentService: AddComponentService) {
        this.addComponentService.subscribe(this.addComponent);
    }

    public openAddDialog(): void {
        this.dialog.open(AddComponentComponent)
    }

    private addComponent(aspect: Aspect): void {
        console.log(aspect);


    }
}
