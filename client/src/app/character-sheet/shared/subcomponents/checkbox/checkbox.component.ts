import { Component, Input, ViewChild } from '@angular/core';
import { SubComponentChild } from '../sub-component-child';
import { Aspect } from '../../aspect';
import { MatMenu } from '@angular/material';
import { CharacterInterfaceService } from '../../character-interface.service';
import { CharacterInterfaceFactory } from '../../character-interface.factory';


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

    private characterService: CharacterInterfaceService;

    constructor(characterInterfaceFactory: CharacterInterfaceFactory) {
			this.characterService = characterInterfaceFactory.getCharacterInterface();
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
        this.characterService.updateFunctionAspects();
    }
}

