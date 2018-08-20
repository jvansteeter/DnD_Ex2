import { Component, Input } from '@angular/core';
import { CharacterSheetRepository } from '../../repositories/character-sheet.repository';
import { CharacterSheetTooltipData } from '../../../../../shared/types/rule-set/character-sheet-tooltip.data';
import { CharacterMakerService } from '../maker/character-maker.service';
import { Aspect, AspectType } from '../shared/aspect';

@Component({
	selector: 'character-tooltip',
	templateUrl: 'character-tooltip.component.html',
	styleUrls: ['character-tooltip.component.scss']
})
export class CharacterTooltipComponent {
	@Input()
	characterSheetId: string;
	@Input()
	public tooltipConfig: CharacterSheetTooltipData;

	aspectType = AspectType;
	public hoveredIndex: number;

	constructor(private characterSheetRepo: CharacterSheetRepository,
	            private characterSheetService: CharacterMakerService) {
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
		return this.characterSheetService.valueOfAspect(aspectLabel);
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
}
