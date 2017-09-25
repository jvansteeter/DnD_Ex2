import { Component, Input, ViewChild } from '@angular/core';
import { SubComponentChild } from '../sub-component-child';
import { Aspect } from '../../aspect';
import { MdMenu } from '@angular/material';
import { SubComponent } from '../sub-component';
import { CharacterMakerService } from '../../character-maker.service';


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

    @ViewChild('options') options: MdMenu;

    constructor(private characterMakerService: CharacterMakerService) {

    }

    resize(width: number, height: number) {
        // does nothing
    }

    getMenuOptions(): MdMenu {
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

