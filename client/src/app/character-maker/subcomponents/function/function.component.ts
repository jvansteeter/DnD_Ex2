import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Aspect } from '../../aspect';
import { SubComponent } from '../sub-component';
import { FunctionDialogComponent } from './function-dialog.component';
import { SubComponentChild } from '../sub-component-child';
import { FunctionGrammar } from './function.grammar';
import { MatDialog, MatMenu } from '@angular/material';

@Component({
    selector: 'characterMaker-functionComponent',
    templateUrl: 'function.component.html',
    styleUrls: ['../sub-component.css']
})
export class FunctionComponent implements SubComponentChild, AfterViewInit {
    @Input() aspect: Aspect;
    @Input() parent: SubComponent;
    @ViewChild('options') options: MatMenu;

    width: number;
    height: number;
    readonly hasOptions: boolean = true;
    value: any;

    fontSize: number = 14;
    private _function: FunctionGrammar;

    constructor(private dialog: MatDialog) {

    }

    ngAfterViewInit(): void {
        // do nothing
    }

    resize(width: number, height: number) {
        // do nothing
    }

    getMenuOptions(): MatMenu {
        return this.options;
    }

    closeOptions(): void {
        this.parent.closeOptions();
    }

    openFunctionDialog(): void {
        this.dialog.open(FunctionDialogComponent).afterClosed().subscribe((result: FunctionGrammar) => {
            if (result) {
                this._function = result;
                this.value = this._function.getValue();
            }
        });
    }

    stopClickPropagate(event): void {
        event.stopPropagation();
    }

    closeMenu(): void {
        // this.options._emitCloseEvent();
    }

    getValue(): any {
        this.value = this._function.getValue();
        return this.value;
    }
}
