import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Aspect } from '../../../../types/character-sheet/aspect';
import { SubComponent } from '../sub-component';
import { SubComponentChild } from '../sub-component-child';
import { MatMenu } from '@angular/material';
import { CharacterInterfaceService } from '../../character-interface.service';
import { CharacterInterfaceFactory } from '../../character-interface.factory';


@Component({
    selector:  'characterMaker-numberComponent',
    templateUrl: 'number.component.html',
    styleUrls: ['../sub-component.scss']
})
export class NumberComponent implements SubComponentChild {
    @Input() aspect: Aspect;
    @ViewChild('options') options: MatMenu;
    @ViewChild('fontSizeInput') fontSizeInput: ElementRef;
    label: string;
    required: boolean;
    hasOptions = true;
    value: any;

    private characterService: CharacterInterfaceService;

    constructor(characterInterfaceFactory: CharacterInterfaceFactory) {
        this.characterService = characterInterfaceFactory.getCharacterInterface();
    }

    getMenuOptions(): MatMenu {
        return this.options;
    }

    stopClickPropagate(event): void {
        event.stopPropagation();
    }

    closeMenu(): void {
        // this.options._emitCloseEvent();
    }

    getValue() {
        return this.value;
    }

    setValue(value: any): any {
        this.value = value;
    }

    valueChanged(): void {
        this.characterService.updateFunctionAspects();
    }
}
