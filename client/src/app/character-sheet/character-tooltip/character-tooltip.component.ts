import { Component, Input } from '@angular/core';
import { CharacterSheetRepository } from '../../repositories/character-sheet.repository';
import { CharacterSheetTooltipData } from '../../../../../shared/types/rule-set/character-sheet-tooltip.data';
import { CharacterMakerService } from '../maker/character-maker.service';
import { Aspect, AspectType } from '../shared/aspect';
import { EncounterService } from '../../encounter/encounter.service';
import { RightsService } from '../../data-services/rights.service';
import { ConditionData } from '../../../../../shared/types/rule-set/condition.data';
import { RuleSetService } from '../../data-services/ruleSet.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';
import { isUndefined } from "util";
import { RuleModuleAspects } from '../../../../../shared/predefined-aspects.enum';
import { isDefined } from "@angular/compiler/src/util";
import { MatDialog } from '@angular/material';
import { NewConditionDialogComponent } from '../../conditions/new-condition-dialog.component';
import { RulesConfigService } from '../../data-services/rules-config.service';
import { Player } from "../../encounter/player";
import { AbilityData } from '../../../../../shared/types/ability.data';
import { EncounterKeyEventService } from '../../encounter/encounter-key-event.service';
import { RuleService } from '../shared/rule/rule.service';

@Component({
	selector: 'character-tooltip',
	templateUrl: 'character-tooltip.component.html',
	styleUrls: ['character-tooltip.component.scss']
})
export class CharacterTooltipComponent {
	@Input()
	characterSheetId: string;

	public aspectType = AspectType;
	public hoveredIndex: number;
	public editingIndex: number = -1;
	public activeTokenIndex: number;
	public activeTokenWidth: number;
	public activeTokenHeight: number;
	public player: Player;
	public filteredConditions: Observable<ConditionData[]>;
	public addConditionControl = new FormControl();

	private _tooltipConfig: CharacterSheetTooltipData;
	private currentMaxAdd: boolean;
	private _playerId: string;
	private focusedAspect: Aspect;
	private modifiers: Map<string, any>;

	constructor(private characterSheetRepo: CharacterSheetRepository,
	            private characterService: CharacterMakerService,
	            private encounterService: EncounterService,
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
				return (condition.name.toLowerCase().indexOf(filterValue) === 0 && !this.playerHasCondition(condition));
			});
		} else {
			return [];
		}
	}

	private playerHasCondition(condition: ConditionData): boolean {
		const conditions: ConditionData[] = this.player.characterData.values[RuleModuleAspects.CONDITIONS];
		if (isDefined(conditions)) {
			for (let existingCondition of conditions) {
				if (condition.name.toLowerCase() === existingCondition.name.toLowerCase()) {
					return true;
				}
			}
		}

		return false;
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
		let value = this.player.characterData.values[aspect.label];
		if (this.focusedAspect !== aspect) {
			if (aspect.aspectType === AspectType.NUMBER && this.modifiers.has(aspect.label)) {
				return String(Number(value) + Number(this.modifiers.get(aspect.label)));
			}
		}

		return value;
	}

	public changeAspectValue(aspectLabel: string, value: any): void {
		this.player.characterData.values[aspectLabel] = value;
		this.player.emitChange();
	}

	public changeCurrentAspectValue(aspectLabel: string, value: number): void {
		this.player.characterData.values[aspectLabel].current = value;
		this.player.emitChange();
	}

	public changeMaxAspectValue(aspectLabel: string, value: number): void {
		this.player.characterData.values[aspectLabel].max = value;
		this.player.emitChange();
	}

	public addCondition(aspectLabel: string, conditionName: string): void {
		for (let condition of this.ruleSetService.conditions) {
			if (condition.name.toLowerCase() === conditionName.toLowerCase()) {
				if (isUndefined(this.player.characterData.values[aspectLabel])) {
					this.player.characterData.values[aspectLabel] = [];
				}
				this.player.characterData.values[aspectLabel].push(condition);
				this.addConditionControl.setValue('');
				this.player.emitChange();
				return;
			}
		}
	}

	public changeConditionRounds(): void {
		this.encounterService.getPlayerById(this._playerId).emitChange();
	}

	public openCreateConditionDialog(aspectLabel: string): void {
		this.stopListeningToKeyEvents();
		this.dialog.open(NewConditionDialogComponent).afterClosed().pipe(first()).subscribe((condition: ConditionData) => {
			if (isDefined(condition)) {
				if (isUndefined(this.player.characterData.values[aspectLabel])) {
					this.player.characterData.values[aspectLabel] = [];
				}
				this.player.characterData.values[aspectLabel].push(condition);
				this.player.emitChange();
			}
			this.startListeningToKeyEvents();
		});
	}

	public removeCondition(aspectLabel: string, conditionName: string): void {
		const conditions: ConditionData[] = this.player.characterData.values[aspectLabel];
		for (let i = 0; i < conditions.length; i++) {
			if (conditionName.toLowerCase() === conditions[i].name.toLowerCase()) {
				conditions.splice(i, 1);
				this.player.emitChange();
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
		let aspectValue: number = +this.player.characterData.values[aspectLabel].current;

		if (this.currentMaxAdd) {
			aspectValue += value;
		} else {
			aspectValue -= value;
		}
		this.changeCurrentAspectValue(aspectLabel, aspectValue);
		this.editingIndex = -1;
	}

	public hasRights(): boolean {
		return this.rightsService.hasRightsToPlayer(this._playerId);
	}

	public activeTokenIndexChange(index: number): void {
		this.activeTokenIndex = index;
		this.player.activeTokenIndex = this.activeTokenIndex;
		this.activeTokenWidth = this.player.tokenWidth;
		this.activeTokenHeight = this.player.tokenHeight;
	}

	public widthChange(): void {
		this.encounterService.getPlayerById(this._playerId).setTokenWidth(this.activeTokenIndex, this.activeTokenWidth);
	}

	public heightChange(): void {
		this.encounterService.getPlayerById(this._playerId).setTokenHeight(this.activeTokenIndex, this.activeTokenHeight);
	}

	public abilityChange(): void {
		this.player.emitChange();
	}

	public abilityExpanded(ability: AbilityData): void {
		this.player.addAura({name: ability.name, range: ability.range, rgbaCode: 'rgba(255,0,0,.5)'});
	}

	public abilityClosed(ability: AbilityData): void {
		this.player.removeAura(ability.name);
	}

	public removeAbilityAuras(): void {
		this.player.removeAuras();
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
		if (this.focusedAspect !== aspect && this.modifiers.has(aspect.label)) {
			return 'blue';
		}

		return 'black';
	}

	set playerId(value) {
		this._playerId = value;
		this.player = this.encounterService.getPlayerById(this._playerId);
		this.activeTokenIndex = this.player.activeTokenIndex;
		this.activeTokenWidth = this.player.tokens[this.activeTokenIndex].widthInCells;
		this.activeTokenHeight = this.player.tokens[this.activeTokenIndex].heightInCells;
	}

	get playerId(): string {
		return this._playerId;
	}

	get tooltipConfig(): CharacterSheetTooltipData {
		return this._tooltipConfig;
	}

	set tooltipConfig(config: CharacterSheetTooltipData) {
		this._tooltipConfig = config;
		this.modifiers = new Map<string, any>();
		for (let aspect of this.tooltipConfig.aspects) {
			if (aspect.aspect.aspectType === AspectType.NUMBER) {
				let ruleModifiers = this.ruleService.getRuleModifiers(aspect.aspect, this.player.characterData.characterSheet.rules, this.player.id);
				let total = 0;
				for (let mod of ruleModifiers.values()) {
					total += Number(mod);
				}
				this.modifiers.set(aspect.aspect.label, total);
			}
		}
	}
}
