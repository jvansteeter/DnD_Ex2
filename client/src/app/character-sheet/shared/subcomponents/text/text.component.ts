import { Component, Input, ViewChild } from '@angular/core';
import { Aspect } from '../../../../types/character-sheet/aspect';
import { SubComponentChild } from '../sub-component-child';
import { MatMenu } from '@angular/material';


@Component({
    selector:  'characterMaker-textComponent',
    templateUrl: 'text.component.html',
    styleUrls: ['../sub-component.scss']
})
export class TextComponent implements SubComponentChild {
    @Input() aspect: Aspect;
    @ViewChild('options') options: MatMenu;
    label: string;
    required: boolean;
    hasOptions = true;
    value: any;

    constructor() {

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
}
