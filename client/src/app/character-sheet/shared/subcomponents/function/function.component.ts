import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Aspect } from '../../aspect';
import { SubComponentChild } from '../sub-component-child';
import { MatDialog, MatMenu } from '@angular/material';
import { CharacterInterfaceService } from '../../character-interface.service';
import { CharacterInterfaceFactory } from '../../character-interface.factory';
import { FunctionTextComponent } from './function-text.component';
import { RuleFunction } from './rule-function';
import { Subscription } from 'rxjs';

@Component({
	selector: 'characterMaker-functionComponent',
	templateUrl: 'function.component.html',
	styleUrls: ['function.component.scss']
})
export class FunctionComponent implements SubComponentChild, AfterViewInit, OnInit, OnDestroy {
	@Input() aspect: Aspect;
	@ViewChild('options', {static: true}) options: MatMenu;

	readonly hasOptions: boolean = true;
	value: any = 'NaN';

	private ruleFunction: RuleFunction;
	private updateSubscription: Subscription;
	private readonly characterService: CharacterInterfaceService;

	constructor(private dialog: MatDialog,
	            characterInterfaceFactory: CharacterInterfaceFactory) {
		this.characterService = characterInterfaceFactory.getCharacterInterface();
	}

	public ngOnInit(): void {
		this.updateSubscription = this.characterService.updateFunctionAspectsObservable().subscribe(() => {
			if (this.ruleFunction) {
				this.value = this.ruleFunction.execute();
			}
			else {
				this.value = 'NaN';
			}
		});
	}

	public ngOnDestroy(): void {
		if (this.updateSubscription) {
			this.updateSubscription.unsubscribe();
		}
	}

	ngAfterViewInit(): void {
		if (!this.aspect.isNew && !!this.aspect.ruleFunction) {
			this.ruleFunction = new RuleFunction(this.aspect.ruleFunction, this.characterService);
			setTimeout(() => {
				this.value = this.ruleFunction.execute();
			});
		}
	}

	getMenuOptions(): MatMenu {
		return this.options;
	}

	openFunctionDialog(): void {
    this.dialog.open(FunctionTextComponent, {data: {ruleFunction: this.aspect.ruleFunction}}).afterClosed().subscribe((ruleFunction: RuleFunction) => {
    	if (!ruleFunction) {
    		return;
	    }
	    this.aspect.ruleFunction = ruleFunction.functionText;
    	this.ruleFunction = ruleFunction;
    	this.value = this.ruleFunction.execute();
		});
	}

	getValue(): any {
		return this.value;
	}

	setValue(value: any): any {
		// do nothing
	}

	getFunction(): string {
		if (this.ruleFunction) {
			return this.ruleFunction.functionText;
		}

		return undefined;
	}
}
