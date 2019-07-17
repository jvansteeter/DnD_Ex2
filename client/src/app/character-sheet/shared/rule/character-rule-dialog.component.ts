import { Component, Inject, OnInit } from '@angular/core';
import { CharacterInterfaceService } from '../character-interface.service';
import { CharacterInterfaceFactory } from '../character-interface.factory';
import { Aspect, AspectType } from '../aspect';
import { RuleData } from '../../../../../../shared/types/rule.data';
import { isNullOrUndefined, isUndefined } from 'util';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AlertService } from '../../../alert/alert.service';
import { RuleFunction } from '../subcomponents/function/rule-function';

@Component({
	templateUrl: 'character-rule-dialog.component.html',
	styleUrls: ['character-rule-dialog.component.scss']
})
export class CharacterRuleDialogComponent implements OnInit {
	private characterService: CharacterInterfaceService;

	public rule: RuleData;
	public aspects: Aspect[];
	public AspectType = AspectType;

	constructor(@Inject(MAT_DIALOG_DATA) private data: any,
	            characterServiceFactory: CharacterInterfaceFactory,
	            private alertService: AlertService,
	            private dialogRef: MatDialogRef<CharacterRuleDialogComponent>) {
		this.characterService = characterServiceFactory.getCharacterInterface();
	}

	public ngOnInit(): void {
		this.aspects = this.characterService.aspects.filter((aspect: Aspect) =>
				aspect.aspectType === AspectType.TEXT ||
				aspect.aspectType === AspectType.NUMBER ||
				aspect.aspectType === AspectType.BOOLEAN ||
				aspect.aspectType === AspectType.BOOLEAN_LIST ||
				aspect.aspectType === AspectType.CATEGORICAL ||
				aspect.aspectType === AspectType.CURRENT_MAX ||
				aspect.aspectType === AspectType.FUNCTION
		);
		if (isNullOrUndefined(this.data)) {
			this.rule = {
				name: '',
				description: '',
				effects: [{
					aspectLabel: '',
					modFunction: 'this = '
				}]
			};
		}
		else {
			this.rule = {
				name: this.data.name,
				description: this.data.description,
				effects: this.data.effects,
			};
		}
	}

	public addEffectRow(): void {
		const lastEffect = this.rule.effects[this.rule.effects.length - 1];
		if (lastEffect.aspectLabel === '' || lastEffect.modFunction === '') {
			return;
		}
		this.rule.effects.push({
			aspectLabel: '',
			modFunction: 'this = '
		});
	}

	public removeEffectRow(): void {
		if (this.rule.effects.length < 2) {
			return;
		}
		this.rule.effects.splice(this.rule.effects.length - 1, 1);
	}

	public selectAspect(effectIndex: number, aspectLabel: string): void {
		this.rule.effects[effectIndex].aspectLabel = aspectLabel;
	}

	public selectAspectItem(effectIndex: number, aspectItem: string): void {
		this.rule.effects[effectIndex].aspectItem = aspectItem;
	}

	public functionChange(effectIndex: number, functionText: string): void {
		this.rule.effects[effectIndex].modFunction = functionText;
	}

	public effectAspectType(effect: {aspectLabel: string, modFunction: string}): AspectType {
		const aspect = this.aspects.find((aspect: Aspect) => aspect.label === effect.aspectLabel);
		if (isUndefined(aspect)) {
			return undefined;
		}
		return aspect.aspectType;
	}

	public typeOptions(effect: {aspectLabel: string, modFunction: string}): string[] {
		const aspect = this.aspects.find((aspect: Aspect) => aspect.label === effect.aspectLabel);
		if (aspect.aspectType === AspectType.CURRENT_MAX) {
			return ['Current', 'Max'];
		}
		else if (aspect.aspectType === AspectType.BOOLEAN_LIST) {
			return aspect.items;
		}
		return [];
	}

	public save(): void {
		for (let effect of this.rule.effects) {
			const result = new RuleFunction(effect.modFunction, this.characterService).execute();
			if (result === 'NaN') {
				this.alertService.showAlert('Invalid Function');
				return;
			}
			else {
				effect.result = result;
			}
		}

		this.dialogRef.close(this.rule);
	}
}

