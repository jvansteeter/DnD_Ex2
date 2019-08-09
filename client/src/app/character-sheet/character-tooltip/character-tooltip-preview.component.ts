import { Component, Input } from '@angular/core';
import { CharacterSheetRepository } from '../../repositories/character-sheet.repository';
import { CharacterSheetTooltipData } from '../../../../../shared/types/rule-set/character-sheet-tooltip.data';
import { CharacterMakerService } from '../maker/character-maker.service';
import { Aspect, AspectType } from '../shared/aspect';
import { RightsService } from '../../data-services/rights.service';
import { ConditionData } from '../../../../../shared/types/rule-set/condition.data';
import { RuleSetService } from '../../data-services/ruleSet.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { isUndefined } from "util";
import { MatDialog } from '@angular/material';
import { RulesConfigService } from '../../data-services/rules-config.service';
import { EncounterKeyEventService } from '../../encounter/encounter-key-event.service';
import { RuleService } from '../shared/rule/rule.service';

@Component({
	selector: 'character-tooltip-preview',
	templateUrl: 'character-tooltip-preview.component.html',
	styleUrls: ['character-tooltip-preview.component.scss']
})
export class CharacterTooltipPreviewComponent {
	@Input()
	characterSheetId: string;

	public aspectType = AspectType;
	public hoveredIndex: number;
	public editingIndex: number = -1;
	public activeTokenIndex: number;
	public filteredConditions: Observable<ConditionData[]>;
	public addConditionControl = new FormControl();

	private _tooltipConfig: CharacterSheetTooltipData;
	private currentMaxAdd: boolean;
	private focusedAspect: Aspect;
	private modifiers: Map<string, any>;

	constructor(private characterSheetRepo: CharacterSheetRepository,
	            private characterService: CharacterMakerService,
	            private rightsService: RightsService,
	            public ruleSetService: RuleSetService,
	            private dialog: MatDialog,
	            private rulesConfigService: RulesConfigService,
	            private keyEventService: EncounterKeyEventService,
	            private ruleService: RuleService,
	) {
		this.filteredConditions = this.addConditionControl.valueChanges.pipe(
				startWith(''),
				map((value: string) => {
					return this.filterConditions(value);
				}));
	}

	private filterConditions(value: string): ConditionData[] {
		if (isUndefined(value)) {
			value = '';
		}
		const filterValue = value.toLowerCase();
		if (Array.isArray(this.ruleSetService.conditions)) {
			return this.ruleSetService.conditions.filter((condition: ConditionData) => {
				return (condition.name.toLowerCase().includes(filterValue));
			});
		}
		else {
			return [];
		}
	}

	public addAspect(aspect: Aspect, icon: string): void {
		let unique = true;
		for (let tooltipAspect of this.tooltipConfig.aspects) {
			if (tooltipAspect.aspect.label.toLowerCase() === aspect.label.toLowerCase()) {
				unique = false;
				break;
			}
		}
		if (unique) {
			this.tooltipConfig.aspects.push({
				icon: icon,
				aspect: aspect
			});
		}
	}

	public removeAspect(aspectLabel: string): void {
		for (let i = 0; i < this.tooltipConfig.aspects.length; i++) {
			if (this.tooltipConfig.aspects[i].aspect.label === aspectLabel) {
				this.tooltipConfig.aspects.splice(i, 1);
				return;
			}
		}
	}

	public aspectValue(aspect: Aspect): string {
		return this.characterService.getAspectValue(aspect.label);
	}

	public changeAspectValue(aspectLabel: string, value: any): void {
		this.characterService.setAspectValue(aspectLabel, value);
	}

	public changeCurrentAspectValue(aspectLabel: string, value: number): void {
		const currentMaxValue = this.characterService.getAspectValue(aspectLabel);
		currentMaxValue.current = value;
	}

	public changeMaxAspectValue(aspectLabel: string, value: number): void {
		const currentMaxValue = this.characterService.getAspectValue(aspectLabel);
		currentMaxValue.max = value;
	}

	public addCondition(aspectLabel: string, conditionName: string): void {
		const conditions: ConditionData[] = this.characterService.getAspectValue(aspectLabel);
		for (let condition of this.ruleSetService.conditions) {
			if (condition.name.toLowerCase() === conditionName.toLowerCase()) {
				conditions.push(condition);
				return;
			}
		}
	}

	public removeCondition(aspectLabel: string, conditionName: string): void {
		const conditions: ConditionData[] = this.characterService.getAspectValue(aspectLabel);
		for (let i = 0; i < conditions.length; i++) {
			let condition = conditions[i];
			if (conditionName.toLowerCase() === condition.name.toLowerCase()) {
				conditions.splice(i, 1);
				return;
			}
		}
	}

	public stopClickPropagate(event): void {
		event.stopPropagation();
	}

	public startHover(index: number): void {
		this.hoveredIndex = index;
	}

	public endHover(): void {
		this.hoveredIndex = undefined;
	}

	public moveUp(index: number): void {
		let aspect = this.tooltipConfig.aspects[index];
		this.tooltipConfig.aspects.splice(index, 1);
		this.tooltipConfig.aspects.splice(index - 1, 0, aspect);
	}

	public moveDown(index: number): void {
		let aspect = this.tooltipConfig.aspects[index];
		this.tooltipConfig.aspects.splice(index, 1);
		this.tooltipConfig.aspects.splice(index + 1, 0, aspect);
	}

	public beginEditCurrentMax(index: number, add: boolean): void {
		this.editingIndex = index;
		this.currentMaxAdd = add;
	}

	public stopEditCurrentMax(): void {
		this.editingIndex = -1;
	}

	public editCurrentMax(aspectLabel: string, value: number): void {
		let aspectValue: number = +this.characterService.getAspectValue(aspectLabel).current;

		if (this.currentMaxAdd) {
			aspectValue += value;
		} else {
			aspectValue -= value;
		}
		this.changeCurrentAspectValue(aspectLabel, aspectValue);
		this.editingIndex = -1;
	}

	public stopListeningToKeyEvents(): void {
		this.keyEventService.stopListeningToKeyEvents()
	}

	public startListeningToKeyEvents(): void {
		this.keyEventService.startListeningToKeyEvents();
	}

	public focusAspect(aspect: Aspect): void {
		this.focusedAspect = aspect;
	}

	public blurAspect(): void {
		this.focusedAspect = undefined;
	}

	public aspectColor(aspect: Aspect): string {
	
		return 'black';
	}

	get tooltipConfig(): CharacterSheetTooltipData {
		return this._tooltipConfig;
	}

	set tooltipConfig(config: CharacterSheetTooltipData) {
		this._tooltipConfig = config;
	}
}
