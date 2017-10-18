import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Aspect } from '../../aspect';
import { SubComponent } from '../sub-component';
import { FunctionDialogComponent } from './function-dialog.component';
import { SubComponentChild } from '../sub-component-child';
import { FunctionGrammar, FunctionTemplate } from './function.grammar';
import { MatDialog, MatMenu } from '@angular/material';
import { CharacterMakerService } from '../../character-maker.service';
import { Observable } from 'rxjs/Observable';

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

    constructor(private dialog: MatDialog, private characterMakerService: CharacterMakerService) {

    }

    ngAfterViewInit(): void {
        if (!this.aspect.isNew && !!this.aspect.ruleFunction) {
            this.setFunction(this.aspect.ruleFunction);
        }
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

    getFunction(): FunctionTemplate | undefined {
        if (this._function) {
            return {
                stack: this._function.getStack(),
                mapValues: this._function.getMapValues()
            };
        }

        return undefined;
    }

    private setFunction(template: FunctionTemplate): void {
        this._function = new FunctionGrammar(this.characterMakerService);
        this._function.initFromTemplate(template);
        Observable.timer(100).subscribe(() => this.getValue());
    }
}
