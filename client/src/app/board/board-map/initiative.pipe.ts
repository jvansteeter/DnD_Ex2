import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../../encounter/player';
import { isNullOrUndefined } from "util";

@Pipe({
	name: 'initiative'
})
export class InitiativePipe implements PipeTransform{
	transform(value: any, ...args: any[]): any {
		const players: Player[] = value as Player[];
		return players.sort((player1: Player, player2: Player) => {
			let localPlayer1;
			if (isNullOrUndefined(player1.initiative)) {
				localPlayer1 = -10;
			} else {
				localPlayer1 = player1.initiative;
			}

			let localPlayer2;
			if (isNullOrUndefined(player2.initiative)) {
				localPlayer2 = -10;
			} else {
				localPlayer2 = player2.initiative;
			}


			if (localPlayer1 < localPlayer2) {
				return 1;
			}
			if (localPlayer1 > localPlayer2) {
				return -1;
			}
			return 0;
		});
	}
}