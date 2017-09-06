import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Aspect } from '../../aspect';
import { SubComponent } from '../sub-component';
import { MdDialog, MdMenu } from '@angular/material';
import { FunctionDialogComponent } from './function-dialog.component';
import { SubComponentChild } from '../sub-component-child';

@Component({
    selector: 'characterMaker-functionComponent',
    templateUrl: 'function.component.html',
    styleUrls: ['../sub-component.css']
})
export class FunctionComponent implements SubComponentChild, AfterViewInit {
    @Input() aspect: Aspect;
    @Input() parent: SubComponent;
    @ViewChild('options') options: MdMenu;

    width: number;
    height: number;
    readonly hasOptions: boolean = true;
    value: any;

    fontSize: number = 14;

    constructor(private dialog: MdDialog) {

    }

    ngAfterViewInit(): void {
        // do nothing
    }

    resize(width: number, height: number) {
        // do nothing
    }

    getMenuOptions(): MdMenu {
        return this.options;
    }

    closeOptions(): void {
        this.parent.closeOptions();
    }

    openFunctionDialog(): void {
        this.dialog.open(FunctionDialogComponent);
    }

    stopClickPropagate(event): void {
        event.stopPropagation();
    }

    closeMenu(): void {
        this.options._emitCloseEvent();
    }
}
