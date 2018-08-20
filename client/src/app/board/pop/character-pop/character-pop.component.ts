import { Component } from '@angular/core';
import { PopService } from '../pop.service';
import { Player } from '../../../encounter/player';
import { BoardStateService } from '../../services/board-state.service';

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
	constructor(
			private boardStateService: BoardStateService
	){}

	public initVars(parentRef: PopService, window: boolean, pos_x: number, pos_y: number, player: Player) {
		this.parentRef = parentRef;

		this.pos_x = pos_x;
		this.pos_y = pos_y;
		this.player = player;
		console.log(player)

		this.window = window;
	}

	close() {
		this.parentRef.clearPlayerPop(this.player._id);
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
}
