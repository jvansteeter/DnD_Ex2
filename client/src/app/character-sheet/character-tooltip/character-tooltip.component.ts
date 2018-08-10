import { Component, Input } from '@angular/core';
import { CharacterSheetRepository } from '../../repositories/character-sheet.repository';
import { CharacterSheetTooltipData } from '../../../../../shared/types/character-sheet-tooltip.data';
import { CharacterMakerService } from '../maker/character-maker.service';

@Component({
	selector: 'character-tooltip',
	templateUrl: 'character-tooltip.component.html',
	styleUrls: ['character-tooltip.component.scss']
})
export class CharacterTooltipComponent {
	@Input()
	characterSheetId: string;

	public tooltipConfig: CharacterSheetTooltipData;
	public hoveredIndex: number;

	constructor(private characterSheetRepo: CharacterSheetRepository,
	            private characterSheetService: CharacterMakerService) {
	}

	public addAspect(aspectLabel: string, icon: string): void {
		let unique = true;
		for (let aspect of this.tooltipConfig.aspects) {
			if (aspect.label.toLowerCase() === aspectLabel.toLowerCase()) {
				unique = false;
				break;
			}
		}
		if (unique) {
			this.tooltipConfig.aspects.push({
				icon: icon,
				label: aspectLabel
			});
		}
	}

	public removeAspect(aspectLabel: string): void {
		for (let i = 0; i < this.tooltipConfig.aspects.length; i++) {
			if (this.tooltipConfig.aspects[i].label === aspectLabel) {
				this.tooltipConfig.aspects.splice(i, 1);
				return;
			}
		}
	}

	public aspectValue(aspectLabel: string): string {
		return this.characterSheetService.getValueOfAspectByLabel(aspectLabel);
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
