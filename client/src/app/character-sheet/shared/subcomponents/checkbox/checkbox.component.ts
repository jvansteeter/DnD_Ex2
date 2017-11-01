import { Component, Input, ViewChild } from '@angular/core';
import { SubComponentChild } from '../sub-component-child';
import { Aspect } from '../../aspect';
import { SubComponent } from '../sub-component';
import { CharacterMakerService } from '../../../maker/character-maker.service';
import { MatMenu } from '@angular/material';


@Component({
    selector: 'characterMaker-checkBoxComponent',
    templateUrl: 'checkbox.component.html',
    styleUrls: ['../sub-component.css']
})
export class CheckboxComponent implements SubComponentChild {
    @Input() aspect: Aspect;
    @Input() parent: SubComponent;
    label: string;
    required: boolean;
    width: number;
    height: number;
    hasOptions = false;
    value: any;

    @ViewChild('options') options: MatMenu;

    constructor(private characterMakerService: CharacterMakerService) {

    }

    getMenuOptions(): MatMenu {
        return this.options;
    }

    closeOptions(): void {
        this.parent.closeOptions();
    }

    getValue() {
        return this.value;
    }

    valueChanged(): void {
        this.characterMakerService.updateFunctionAspects();
    }
}

