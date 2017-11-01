import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SubComponentChild } from '../sub-component-child';
import { Aspect } from '../../aspect';
import { SubComponent } from '../sub-component';
import { MatMenu } from '@angular/material';


interface TextItem {
    value: string
}

@Component({
    selector: 'characterMaker-textListComponent',
    templateUrl: 'text-list.component.html',
    styleUrls: ['../sub-component.css']
})
export class TextListComponent implements SubComponentChild {
    @Input() aspect: Aspect;
    @Input() parent: SubComponent;
    @ViewChild('options') options: MatMenu;
    label: string;
    required: boolean;
    readonly hasOptions = true;
    value: any;

    private items: TextItem[];
    @ViewChild('fontSizeInput') fontSizeInput: ElementRef;

    constructor() {
        this.items = [];
    }

    getMenuOptions(): MatMenu {
        return this.options;
    }

    closeOptions(): void {
        this.parent.closeOptions();
    }

    addItem(): void {
        this.items.push({value: ''});
    }

    removeItem(): void {
        this.items.splice(this.items.length - 1, 1);
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

