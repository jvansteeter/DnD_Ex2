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
                type: AspectType.TEXT,
                label: 'Text'
            },
            {
                type: AspectType.BOOLEAN,
                label: 'Check Box'
            },
            {
                type: AspectType.NUMBER,
                label: 'Number'
            },
            {
                type: AspectType.BOOLEAN_LIST,
                label: 'List of Checkboxes'
            },
            {
                type: AspectType.TEXT_LIST,
                label: 'List of Text'
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
