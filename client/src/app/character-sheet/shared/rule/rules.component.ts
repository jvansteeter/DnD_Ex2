import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CharacterRuleDialogComponent } from './character-rule-dialog.component';
import { RuleData } from '../../../../../../shared/types/rule.data';
import { isDefined } from '@angular/compiler/src/util';
import { MatDialog } from '@angular/material';

@Component({
	selector: 'character-rules',
	templateUrl: 'rules.component.html',
	styleUrls: ['rules.component.scss']
})
export class RulesComponent {
	@Input()
	public rules: RuleData[] = [];
	@Input()
	public editable: boolean = true;
	@Output()
	public change = new EventEmitter();

	constructor(private dialog: MatDialog) {

	}

	public startNewRule(): void {
		this.dialog.open(CharacterRuleDialogComponent).afterClosed().subscribe((rule: RuleData) => {
			if (isDefined(rule)) {
				this.rules.push(rule);
				this.change.emit();
			}
		});
	}

	public removeRule(index: number): void {
		this.rules.splice(index, 1);
		this.change.emit();
	}

	public editRule(index: number): void {
		this.dialog.open(CharacterRuleDialogComponent, {data: this.rules[index]}).afterClosed().subscribe((rule: RuleData) => {
			if (isDefined(rule)) {
				this.rules.splice(index, 1, rule);
				this.change.emit();
			}
		});
	}
}
