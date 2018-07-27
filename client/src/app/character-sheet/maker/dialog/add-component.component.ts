import { Component } from '@angular/core';
import { Aspect, AspectType } from '../../../types/character-sheet/aspect';
import { CharacterMakerService } from '../character-maker.service';
import { MatDialogRef } from '@angular/material';


@Component({
    templateUrl: 'add-component.component.html',
    styleUrls: ['../../shared/character-sheet.scss']
})
export class AddComponentComponent {
    private aspectTypes: any[];

    private label: string;
    private aspectType: AspectType;
    private required: boolean = false;

    constructor(private dialogRef: MatDialogRef<AddComponentComponent>,
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
            },
            {
                type: AspectType.CATEGORICAL,
                label: 'Category'
            },
            {
                type: AspectType.TOKEN,
                label: 'Map Token'
            },
            {
                type: AspectType.FUNCTION,
                label: 'Function'
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
