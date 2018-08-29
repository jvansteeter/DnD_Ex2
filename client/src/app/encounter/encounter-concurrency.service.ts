import { Injectable } from '@angular/core';
import { EncounterService } from './encounter.service';
import { IsReadyService } from '../utilities/services/isReady.service';
import { MqService } from '../mq/mq.service';
import { UserProfileService } from '../data-services/userProfile.service';
import { EncounterCommandType } from '../../../../shared/types/encounter/encounter-command.enum';
import { PlayerData } from '../../../../shared/types/encounter/player.data';
import { BoardPlayerService } from '../board/services/board-player.service';
import { EncounterCommandMessage } from '../mq/messages/encounter-command.message';
import { Player } from './player';

@Injectable()
export class EncounterConcurrencyService extends IsReadyService {
	constructor(private encounterService: EncounterService,
	            private playerService: BoardPlayerService,
	            private userProfileService: UserProfileService,
	            private mqService: MqService) {
		super(encounterService, mqService);
	}

	init(): void {
		this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady) {
				this.observeEncounterMqMessages();
				this.observeAllPlayerChanges();
				this.setReady(true);
			}
		});
	}

	private observePlayerChanges(player: Player): void {
		player.changeObservable.subscribe(() => {
			this.mqService.publishEncounterCommand(this.encounterService.encounterState._id, this.encounterService.encounterState.version + 1,
					EncounterCommandType.PLAYER_UPDATE, player.serialize());
		});
	}

	private observeEncounterMqMessages(): void {
		this.mqService.getEncounterMessages(this.encounterService.encounterState._id).subscribe((message: EncounterCommandMessage) => {
			console.log(message)
			if (message.body.version === this.encounterService.version + 1) {
				this.doEncounterCommand(message);
				this.encounterService.version++;
			}
		});
	}

	private doEncounterCommand(message: EncounterCommandMessage): void {
		switch (message.body.dataType) {
			case EncounterCommandType.PLAYER_UPDATE: {
				this.updatePlayer(message.body.data as PlayerData);
				break;
			}
			case EncounterCommandType.ADD_PLAYER: {
				const player = new Player(message.body.data as PlayerData);
				this.playerService.addPlayer(player);
				this.observePlayerChanges(player);
				break;
			}
			case EncounterCommandType.REMOVE_PLAYER: {
				const player = new Player(message.body.data as PlayerData);
				this.playerService.removePlayer(player);
				break;
			}
			default: {
				console.error('Encounter Command Type not recognized');
			}
		}
	}

	private observeAllPlayerChanges(): void {
		for (let player of this.encounterService.players) {
			this.observePlayerChanges(player);
		}
	}

	private updatePlayer(playerData: PlayerData): void {
		for (const player of this.encounterService.players) {
			if (player.id === playerData._id) {
				player.setPlayerData(playerData);
				return;
			}
		}
	}
}
