import { Component, Input, ViewChild } from '@angular/core';
import { SubComponentChild } from '../sub-component-child';
import { Aspect } from '../../aspect';
import { CharacterMakerService } from '../../../maker/character-maker.service';
import { MatMenu } from '@angular/material';


@Component({
    selector: 'characterMaker-checkBoxComponent',
    templateUrl: 'checkbox.component.html',
    styleUrls: ['checkbox.component.scss']
})
export class CheckboxComponent implements SubComponentChild {
    @Input() aspect: Aspect;
    hasOptions = false;
    value: boolean;

    @ViewChild('options', {static: true}) options: MatMenu;

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

