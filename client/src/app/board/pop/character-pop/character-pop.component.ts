import { Component, HostListener, ViewChild } from '@angular/core';
import { PopService } from '../pop.service';
import { Player } from '../../../encounter/player';
import { CharacterTooltipComponent } from '../../../character-sheet/character-tooltip/character-tooltip.component';
import { BoardStateService } from '../../services/board-state.service';
import { EncounterRepository } from '../../../repositories/encounter.repository';
import { RightsService } from '../../../data-services/rights.service';
import { UserProfileService } from '../../../data-services/userProfile.service';

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

	@ViewChild(CharacterTooltipComponent)
	tooltipComponent: CharacterTooltipComponent;
	hovered = false;
	hasRights = false;

	constructor(private boardStateService: BoardStateService,
	            private encounterRepo: EncounterRepository,
	            private rightsService: RightsService,
	            private userProfileService: UserProfileService) {
	}

	public initVars(parentRef: PopService, window: boolean, pos_x: number, pos_y: number, player: Player) {
		this.parentRef = parentRef;

		this.pos_x = pos_x;
		this.pos_y = pos_y;
		this.player = player;
		this.tooltipComponent.playerId = player.id;
		this.tooltipComponent.tooltipConfig = player.characterData.characterSheet.tooltipConfig;

		if (this.rightsService.isEncounterGM() || this.userProfileService.userId === player.characterData.creatorUserId) {
			this.hasRights = true;
		}

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

	mouseDown(event) {
		switch (event.which) {
			case 1:
				this.boardStateService.mouseLeftDown = true;
				break;
			case 2:
				break;
			case 3:
				break;
		}
	}

	mouseUp(event) {
		switch (event.which) {
			case 1:
				this.boardStateService.mouseLeftDown = false;
				break;
			case 2:
				break;
			case 3:
				break;
		}
	}

	mouseMove(event) {
		if (this.boardStateService.mouseLeftDown) {
			this.pos_x = this.pos_x + event.movementX;
			this.pos_y = this.pos_y + event.movementY;
		}
	}

	toggleVisibility(): void {
		this.player.isVisible = !this.player.isVisible;
	}
}
