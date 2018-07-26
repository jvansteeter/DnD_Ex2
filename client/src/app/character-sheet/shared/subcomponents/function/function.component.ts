import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Aspect } from '../../../../types/character-sheet/aspect';
import { SubComponent } from '../sub-component';
import { FunctionDialogComponent } from './function-dialog.component';
import { SubComponentChild } from '../sub-component-child';
import { FunctionGrammar, FunctionTemplate } from './function.grammar';
import { MatDialog, MatMenu } from '@angular/material';
import { timer} from 'rxjs';
import { CharacterInterfaceService } from '../../character-interface.service';
import { CharacterInterfaceFactory } from '../../character-interface.factory';

@Component({
    selector: 'characterMaker-functionComponent',
    templateUrl: 'function.component.html',
    styleUrls: ['../sub-component.scss']
})
export class FunctionComponent implements SubComponentChild, AfterViewInit {
    @Input() aspect: Aspect;
    @ViewChild('options') options: MatMenu;

    readonly hasOptions: boolean = true;
    value: any;

    private _function: FunctionGrammar;
    private characterService: CharacterInterfaceService;

    constructor(private dialog: MatDialog,
                characterInterfaceFactory: CharacterInterfaceFactory) {
        this.characterService = characterInterfaceFactory.getCharacterInterface();
    }

    ngAfterViewInit(): void {
        if (!this.aspect.isNew && !!this.aspect.ruleFunction) {
            this.setFunction(this.aspect.ruleFunction);
        }
    }

    getMenuOptions(): MatMenu {
        return this.options;
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
        if (this._function) {
            this.value = this._function.getValue();
        }
        return this.value;
    }

    setValue(value: any): any {
        // do nothing
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
        this._function = new FunctionGrammar(this.characterService);
        this._function.initFromTemplate(template);
        timer(100).subscribe(() => this.getValue());
    }
}
