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
import { BoardLightService } from '../board/services/board-light.service';
import { LightSource } from '../board/map-objects/light-source';
import { BoardNotationService } from '../board/services/board-notation-service';
import { NotationData } from '../../../../shared/types/encounter/board/notation.data';
import { Subscription } from 'rxjs';

@Injectable()
export class EncounterConcurrencyService extends IsReadyService {
	private encounterSubscription: Subscription;
	private lightSourceSubscription: Subscription;
	private notationSubscription: Subscription;
	private ephemeralNotationSubscription: Subscription;
	private playerSubscriptions: Subscription[] = [];

	constructor(private encounterService: EncounterService,
	            private playerService: BoardPlayerService,
	            private userProfileService: UserProfileService,
	            private lightService: BoardLightService,
	            private notationService: BoardNotationService,
	            private mqService: MqService) {
		super(encounterService, mqService, notationService, userProfileService, playerService, lightService);
	}

	init(): void {
		this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady) {
				if (this.isReady().getValue()) {
					return;
				}
				this.observeEncounterMqMessages();
				this.observeAllPlayerChanges();
				this.observeLightSourceChanges();
				this.observeNotationChanges();
				this.setReady(true);
			}
		});
	}

	private observeEncounterMqMessages(): void {
		if (this.encounterSubscription) {
			this.encounterSubscription.unsubscribe();
		}
		this.encounterSubscription = this.mqService.getEncounterMessages(this.encounterService.encounterState._id).subscribe((message: EncounterCommandMessage) => {
			console.log(message)
			if (message.body.version === this.encounterService.version + 1) {
				this.doEncounterCommand(message);
				this.encounterService.version++;
			}
		});
	}

	private observeAllPlayerChanges(): void {
		if (this.playerSubscriptions.length > 0) {
			for (let sub of this.playerSubscriptions) {
				sub.unsubscribe();
			}
			this.playerSubscriptions = [];
		}
		for (let player of this.encounterService.players) {
			this.observePlayerChanges(player);
		}
	}

	private observePlayerChanges(player: Player): void {
		this.playerSubscriptions.push(player.changeObservable.subscribe(() => {
			this.mqService.publishEncounterCommand(this.encounterService.encounterState._id, this.encounterService.encounterState.version + 1,
					EncounterCommandType.PLAYER_UPDATE, player.serialize());
		}));
	}

	private observeLightSourceChanges(): void {
		if (this.lightSourceSubscription) {
			this.lightSourceSubscription.unsubscribe();
		}
		this.lightSourceSubscription = this.lightService.lightSourcesChangeObservable.subscribe(() => {
			this.mqService.publishEncounterCommand(this.encounterService.encounterState._id, this.encounterService.encounterState.version + 1,
					EncounterCommandType.LIGHT_SOURCE, this.lightService.getSerializedState());
		});
	}

	private observeNotationChanges(): void {
		if (this.notationSubscription) {
			this.notationSubscription.unsubscribe();
		}
		this.notationSubscription = this.notationService.notationsChangeObservable.subscribe((notation) => {
			this.mqService.publishEncounterCommand(this.encounterService.encounterState._id, this.encounterService.encounterState.version + 1,
					EncounterCommandType.NOTATION_UPDATE, notation);
		});

		if (this.ephemeralNotationSubscription) {
			this.ephemeralNotationSubscription.unsubscribe();
		}
		this.ephemeralNotationSubscription = this.notationService.ephemerailNotationChangeObservable.subscribe(() => {
			const ephemeralNotation = this.notationService.ephemeralNotationMap.get(this.userProfileService.userId);
			this.mqService.publishEncounterCommand(this.encounterService.encounterState._id, this.encounterService.encounterState.version + 1,
					EncounterCommandType.EPHEMERAL_NOTATION, ephemeralNotation);
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
			case EncounterCommandType.LIGHT_SOURCE: {
				this.lightService.lightSources = JSON.parse(String(message.body.data)) as Array<LightSource>;
				break;
			}
			case EncounterCommandType.ADD_NOTATION: {
				if (message.body.userId === this.userProfileService.userId) {
					return;
				}
				this.notationService.addNotation(message.body.data as NotationData);
				break;
			}
			case EncounterCommandType.NOTATION_UPDATE: {
				this.notationService.setNotation(JSON.parse(String(message.body.data)) as NotationData);
				break;
			}
			case EncounterCommandType.REMOVE_NOTATION: {
				this.notationService.deleteNotation(String(message.body.data));
				break;
			}
			case EncounterCommandType.EPHEMERAL_NOTATION: {
				if (message.body.userId !== this.userProfileService.userId) {
					this.notationService.addEphemeralNotation(message.body.data, message.body.userId);
				}
				break;
			}
			default: {
				console.error('Encounter Command Type not recognized');
				console.log(message)
			}
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
