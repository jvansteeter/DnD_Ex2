import { Component, HostListener, ViewChild } from '@angular/core';
import { PopService } from '../pop.service';
import { Player } from '../../../encounter/player';
import { CharacterTooltipComponent } from '../../../character-sheet/character-tooltip/character-tooltip.component';
import { BoardStateService } from '../../services/board-state.service';
import { EncounterRepository } from '../../../repositories/encounter.repository';
import { RightsService } from '../../../data-services/rights.service';
import { isUndefined } from 'util';

@Component({
	templateUrl: 'character-pop.component.html',
	styleUrls: ['character-pop.component.scss']
})
export class CharacterPopComponent {
	parentRef: PopService;

	pos_x: number;
	pos_y: number;
	player: Player;

	window = false;

	@ViewChild(CharacterTooltipComponent, {static: false})
	tooltipComponent: CharacterTooltipComponent;
	hovered = false;

	constructor(private boardStateService: BoardStateService,
	            private encounterRepo: EncounterRepository,
	            private rightsService: RightsService) {
	}

	public initVars(parentRef: PopService, window: boolean, pos_x: number, pos_y: number, player: Player) {
		this.parentRef = parentRef;

		this.pos_x = pos_x;
		this.pos_y = pos_y;
		this.player = player;
		this.tooltipComponent.playerId = player.id;
		this.tooltipComponent.tooltipConfig = player.characterData.characterSheet.tooltipConfig;

		this.window = window;
	}

	@HostListener('mouseenter')
	hoverStart(): void {
		this.hovered = true;
	}

	@HostListener('mouseleave')
	hoverEnd(): void {
		this.hovered = false;
	}

	close() {
		this.parentRef.clearPlayerPop(this.player._id);
	}

	deletePlayer(): void {
		this.close();
		this.encounterRepo.removePlayer(this.player.serialize()).subscribe();
	}

	toggleVisibility(): void {
		this.player.isVisible = !this.player.isVisible;
	}

	public hasRights(): boolean {
		if (isUndefined(this.tooltipComponent)) {
			return false;
		}

		return this.rightsService.hasRightsToPlayer(this.tooltipComponent.playerId);
	}
}
