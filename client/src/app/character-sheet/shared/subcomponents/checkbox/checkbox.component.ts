import { Component, Input, ViewChild } from '@angular/core';
import { SubComponentChild } from '../sub-component-child';
import { Aspect } from '../../../../types/character-sheet/aspect';
import { SubComponent } from '../sub-component';
import { CharacterMakerService } from '../../../maker/character-maker.service';
import { MatMenu } from '@angular/material';


@Component({
    selector: 'characterMaker-checkBoxComponent',
    templateUrl: 'checkbox.component.html',
    styleUrls: ['../sub-component.scss']
})
export class CheckboxComponent implements SubComponentChild {
    @Input() aspect: Aspect;
    label: string;
    required: boolean;
    width: number;
    height: number;
    hasOptions = false;
    value: boolean;

    @ViewChild('options') options: MatMenu;

    constructor(private characterMakerService: CharacterMakerService) {

    }

    getMenuOptions(): MatMenu {
        return this.options;
    }

    getValue() {
        return this.value;
    }

    setValue(value: any): void {
        this.value = value;
    }

    valueChanged(): void {
        this.characterMakerService.updateFunctionAspects();
    }
}

