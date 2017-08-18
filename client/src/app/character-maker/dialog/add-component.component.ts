import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Aspect, AspectType } from '../aspect';
import { CharacterMakerService } from '../character-maker.service';


@Component({
    templateUrl: 'add-component.component.html',
    styleUrls: ['../character-maker.component.css']
})
export class AddComponentComponent {
    private aspectTypes: any[];

    private label: string;
    private aspectType: AspectType;
    private required: boolean = false;

    constructor(private dialogRef: MdDialogRef<AddComponentComponent>,
                private addComponentService: CharacterMakerService) {
        this.aspectTypes = [
            {
                type: AspectType.text,
                label: 'Text'
            },
            {
                type: AspectType.boolean,
                label: 'Check Box'
            }
        ]
    }

    public addComponent(): void {
        if (this.label && this.aspectType !== undefined) {
            let aspect = new Aspect(this.label, this.aspectType, this.required);
            this.addComponentService.addComponent(aspect);
            this.dialogRef.close();
        }
    }
}