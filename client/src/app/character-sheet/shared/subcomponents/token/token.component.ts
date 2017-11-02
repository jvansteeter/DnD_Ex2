import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Aspect } from '../../../../types/character-sheet/aspect';
import { SubComponent } from '../sub-component';
import { SubComponentChild } from '../sub-component-child';
import { MatMenu } from '@angular/material';


@Component({
    selector:  'characterMaker-tokenComponent',
    templateUrl: 'token.component.html',
    styleUrls: ['../sub-component.css']
})
export class TokenComponent implements SubComponentChild, AfterViewInit{
    @Input() aspect: Aspect;
    @ViewChild('options') options: MatMenu;
    label: string;
    required: boolean;
    readonly hasOptions = false;
    value: any;

    constructor() {

    }

    ngAfterViewInit(): void {
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
