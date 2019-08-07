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

	constructor(private characterSheetRepo: CharacterSheetRepository,
	            private characterService: CharacterMakerService,
	            private encounterService: EncounterService,
	            private rightsService: RightsService,
	            public ruleSetService: RuleSetService,
	            private dialog: MatDialog,
	            private rulesConfigService: RulesConfigService,
	            private keyEventService: EncounterKeyEventService,
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
		const conditions: ConditionData[] = this.player.getAspectValue(RuleModuleAspects.CONDITIONS);
		if (isDefined(conditions)) {
			for (let existingCondition of conditions) {
				if (condition.name.toLowerCase() === existingCondition.name.toLowerCase()) {
					return true;
				}
			}
		}

		return false;
	}

	public aspectValue(aspect: Aspect): any {
		if (this.focusedAspect === aspect) {
			return this.player.getAspectValue(aspect.label, false);
		}
		return this.player.getAspectValue(aspect.label, true);
	}

	public changeAspectValue(aspect: Aspect, value: any): void {
		this.player.setAspectValue(aspect, value);
	}

	public changeCurrentAspectValue(aspect: Aspect, value: number): void {
		this.player.setAspectValue(aspect, value, 'current');
	}

	public changeMaxAspectValue(aspect: Aspect, value: number): void {
		this.player.setAspectValue(aspect, value, 'max');
	}

	public addCondition(aspect: Aspect, conditionName: string): void {
		for (let condition of this.ruleSetService.conditions) {
			if (condition.name.toLowerCase() === conditionName.toLowerCase()) {
				if (isUndefined(this.player.getAspectValue(aspect.label))) {
					this.player.setAspectValue(aspect, []);
				}
				this.player.getAspectValue(aspect.label).push(condition);
				this.addConditionControl.setValue('');
				this.player.emitChange();
				return;
			}
		}
	}

	public changeConditionRounds(): void {
		this.encounterService.getPlayerById(this._playerId).emitChange();
	}

	public openCreateConditionDialog(aspect: Aspect): void {
		this.stopListeningToKeyEvents();
		this.dialog.open(NewConditionDialogComponent).afterClosed().pipe(first()).subscribe((condition: ConditionData) => {
			if (isDefined(condition)) {
				if (isUndefined(this.player.getAspectValue(aspect.label))) {
					this.player.setAspectValue(aspect,[]);
				}
				this.player.getAspectValue(aspect.label).push(condition);
				this.player.emitChange();
			}
			this.startListeningToKeyEvents();
		});
	}

	public removeCondition(aspectLabel: string, conditionName: string): void {
		const conditions: ConditionData[] = this.player.getAspectValue(aspectLabel);
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

	public beginEditCurrentMax(index: number, add: boolean): void {
		this.editingIndex = index;
		this.currentMaxAdd = add;
	}

	public stopEditCurrentMax(): void {
		this.editingIndex = -1;
	}

	public editCurrentMax(aspect: Aspect, value: number): void {
		let aspectValue: number = +this.player.getAspectValue(aspect.label).current;

		if (this.currentMaxAdd) {
			aspectValue += value;
		} else {
			aspectValue -= value;
		}
		this.changeCurrentAspectValue(aspect, aspectValue);
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

	public aspectColor(aspect: Aspect, aspectItem?: string): string {
		if (this.focusedAspect !== aspect && this.player.modifiers.has(aspect.label)) {
			if (aspect.aspectType === AspectType.CURRENT_MAX) {
				const mod = this.player.modifiers.get(aspect.label);
				if (aspectItem.toLowerCase() === 'current' && mod.current !== 0) {
					return 'blue';
				}
				if (aspectItem.toLowerCase() === 'max' && mod.max !== 0) {
					return 'blue';
				}
			}
			else if (aspect.aspectType === AspectType.NUMBER) {
				return 'blue';
			}
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
	}
}
