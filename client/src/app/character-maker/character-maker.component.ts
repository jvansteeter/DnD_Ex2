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
        console.log(this.childAspects);
        this.dialog.open(AddComponentComponent)
    }

    // private aspectType() {
    //     return AspectType;
    // }

    private addComponent(aspect: Aspect): void {
        console.log(aspect);
        console.log(this.childAspects);
        console.log('addComponent was called');
        if (aspect.aspectType === AspectType.text) {
            console.log('adding the aspect')
            this.childAspects.push(aspect);
        }

    }
}
