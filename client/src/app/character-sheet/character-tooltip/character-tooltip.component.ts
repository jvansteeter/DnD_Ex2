import { Component, Input } from '@angular/core';
import { CharacterSheetRepository } from '../../repositories/character-sheet.repository';
import { CharacterSheetTooltipData } from '../../../../../shared/types/rule-set/character-sheet-tooltip.data';
import { CharacterMakerService } from '../maker/character-maker.service';
import { Aspect, AspectType } from '../shared/aspect';
import { EncounterService } from '../../encounter/encounter.service';
import { RightsService } from '../../data-services/rights.service';

@Component({
	selector: 'character-tooltip',
	templateUrl: 'character-tooltip.component.html',
	styleUrls: ['character-tooltip.component.scss']
})
export class CharacterTooltipComponent {
	@Input()
	characterSheetId: string;
	@Input()
	public editable: boolean = false;

	public tooltipConfig: CharacterSheetTooltipData;
	public aspectType = AspectType;
	public hoveredIndex: number;
	public editingIndex: number = -1;
	private currentMaxAdd: boolean;

	private _playerId: string;

	constructor(private characterSheetRepo: CharacterSheetRepository,
	            private characterService: CharacterMakerService,
	            private encounterService: EncounterService,
	            private rightsService: RightsService,
	            ) {
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

	public aspectValue(aspectLabel: string): string {
		if (this.editable) {
			return this.characterService.getAspectValue(aspectLabel);
		}
		else {
			return this.encounterService.getAspectValue(this._playerId, aspectLabel);
		}
	}

	public changeAspectValue(aspectLabel: string, value: any): void {
		if (this.editable) {
			this.characterService.setAspectValue(aspectLabel, value);
		}
		else {
			const player = this.encounterService.getPlayerById(this._playerId);
			player.characterData.values[aspectLabel] = value;
			player.emitChange();
		}
	}

	public changeCurrentAspectValue(aspectLabel: string, value: number): void {
		if (this.editable) {
			const currentMaxValue = this.characterService.getAspectValue(aspectLabel);
			currentMaxValue.current = value;
		}
		else {
			const player = this.encounterService.getPlayerById(this._playerId);
			player.characterData.values[aspectLabel].current = value;
			player.emitChange();
		}
	}

	public changeMaxAspectValue(aspectLabel: string, value: number): void {
		if (this.editable) {
			const currentMaxValue = this.characterService.getAspectValue(aspectLabel);
			currentMaxValue.max = value;
		}
		else {
			const player = this.encounterService.getPlayerById(this._playerId);
			player.characterData.values[aspectLabel].max = value;
			player.emitChange();
		}
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

	public editCurrentMax(aspectLabel: string, value: number): void {
		const player = this.encounterService.getPlayerById(this._playerId);
		let aspectValue: number = +player.characterData.values[aspectLabel].current;

		if (this.currentMaxAdd) {
			aspectValue += value;
		}
		else {
			aspectValue -= value;
		}
		this.changeCurrentAspectValue(aspectLabel, aspectValue);
		this.editingIndex = -1;
	}

	public hasRights(): boolean {
		return this.rightsService.hasRightsToPlayer(this._playerId);
	}

	set playerId(value) {
		this._playerId = value;
	}

	get playerId(): string {
		return this._playerId;
	}
}
