import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Aspect } from '../../aspect';
import { SubComponent } from '../sub-component';
import { SubComponentChild } from '../sub-component-child';
import { MdMenu } from '@angular/material';


@Component({
    selector:  'characterMaker-tokenComponent',
    templateUrl: 'token.component.html',
    styleUrls: ['../sub-component.css']
})
export class TokenComponent implements SubComponentChild, AfterViewInit{
    @Input() aspect: Aspect;
    @Input() parent: SubComponent;
    @ViewChild('options') options: MdMenu;
    label: string;
    required: boolean;
    width: number = 72;
    height: number = 76;
    readonly hasOptions = false;
    value: any;

    readonly widthMargin = 3;
    readonly heightMargin = 26;

    constructor() {

    }

    ngAfterViewInit(): void {
    }

    public resize(width: number, height: number): void {
        this.width = width + this.widthMargin;
        this.height = height + this.heightMargin;
    }

    getMenuOptions(): MdMenu {
        return this.options;
    }

    closeOptions(): void {
        this.parent.closeOptions();
    }

    stopClickPropagate(event): void {
        event.stopPropagation();
    }

    closeMenu(): void {
        this.options._emitCloseEvent();
    }
}
