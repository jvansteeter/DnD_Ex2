import { Injectable } from '@angular/core';
import { EncounterService } from './encounter.service';
import { IsReadyService } from '../utilities/services/isReady.service';
import { StompMessage } from '../mq/messages/stomp-message';
import { MqService } from '../mq/mq.service';
import { EncounterUpdateMessage } from '../mq/messages/encounter-update.message';
import { PlayerData } from '../../../../shared/types/encounter/player';
import { UserProfileService } from '../data-services/userProfile.service';
import { EncounterCommand } from '../../../../shared/types/encounter/encounter-command.enum';

@Injectable()
export class EncounterConcurrencyService extends IsReadyService {
	constructor(private encounterService: EncounterService,
	            private userProfileService: UserProfileService,
	            private mqService: MqService) {
		super(encounterService, mqService);
	}

	init(): void {
		this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady) {
				this.observeEncounterMqMessages();
				this.observePlayerChanges();
				this.setReady(true);
			}
		});
	}

	private observeEncounterMqMessages(): void {
		this.mqService.getEncounterMessages(this.encounterService.encounterState._id).subscribe((message: EncounterUpdateMessage) => {
			if (message.body.userId === this.userProfileService.userId) {
				return;
			}
			switch (message.body.dataType) {
				case (EncounterCommand.PLAYER_UPDATE): {
					this.updatePlayer(message.body.data as PlayerData);
					break;
				}
				default: {
					console.error('Encounter Data Type not recognized');
				}
			}
		});
	}

	private observePlayerChanges(): void {
		for (let player of this.encounterService.players) {
			player.changeObservable.subscribe(() => {
				this.mqService.publishEncounterUpdate(this.encounterService.encounterState._id, this.encounterService.encounterState.version,
						EncounterCommand.PLAYER_UPDATE, player.serialize());
			});
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