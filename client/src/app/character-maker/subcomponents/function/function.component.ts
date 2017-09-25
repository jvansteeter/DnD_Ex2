import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Aspect } from '../../aspect';
import { SubComponent } from '../sub-component';
import { MdDialog, MdMenu } from '@angular/material';
import { FunctionDialogComponent } from './function-dialog.component';
import { SubComponentChild } from '../sub-component-child';
import { FunctionGrammar } from './function.grammar';

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
    private _function: FunctionGrammar;

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
        this.dialog.open(FunctionDialogComponent).afterClosed().subscribe((result: FunctionGrammar) => {
            console.log('open has ended')
            console.log(result)
            if (result) {
                this._function = result;
                this.value = this._function.getValue();
                console.log('final value')
                console.log(this.value)
            }
        });
    }

    stopClickPropagate(event): void {
        event.stopPropagation();
    }

    closeMenu(): void {
        this.options._emitCloseEvent();
    }
}
