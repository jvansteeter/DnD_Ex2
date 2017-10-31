import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Aspect } from '../../aspect';
import { SubComponent } from '../sub-component';
import { SubComponentChild } from '../sub-component-child';
import { MatMenu } from '@angular/material';


@Component({
    selector:  'characterMaker-textComponent',
    templateUrl: 'text.component.html',
    styleUrls: ['../sub-component.css']
})
export class TextComponent implements SubComponentChild {
    @Input() aspect: Aspect;
    @Input() parent: SubComponent;
    @ViewChild('options') options: MatMenu;
    @ViewChild('fontSizeInput') fontSizeInput: ElementRef;
    label: string;
    required: boolean;
    hasOptions = true;
    value: any;

    constructor() {

    }

    getMenuOptions(): MatMenu {
        return this.options;
    }

    closeOptions(): void {
        this.parent.closeOptions();
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
}
