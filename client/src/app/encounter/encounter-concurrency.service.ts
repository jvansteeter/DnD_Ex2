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
import { BoardWallService } from '../board/services/board-wall.service';
import { CellTarget } from '../board/shared/cell-target';
import { EncounterConfigData } from '../../../../shared/types/encounter/encounter-config.data';
import { EncounterTeamsData } from '../../../../shared/types/encounter/encounter-teams.data';
import { BoardTeamsService } from '../board/services/board-teams.service';
import { isUndefined } from 'util';
import { SubSink } from 'subsink';

@Injectable()
export class EncounterConcurrencyService extends IsReadyService {
	private concurrentSubs: SubSink = new SubSink();

	constructor(private encounterService: EncounterService,
	            private playerService: BoardPlayerService,
	            private userProfileService: UserProfileService,
	            private lightService: BoardLightService,
	            private notationService: BoardNotationService,
	            private wallService: BoardWallService,
	            private teamsService: BoardTeamsService,
	            private mqService: MqService) {
		super(encounterService, mqService, notationService, userProfileService, playerService, lightService, wallService);
	}

	init(): void {
		this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady && !this.isReady()) {
				this.observeEncounterMqMessages();
				this.observeAllPlayerChanges();
				this.observeLightSourceChanges();
				this.observeNotationChanges();
				this.observerWallChanges();
				this.observerDoorChanges();
				this.observeConfigChanges();
				this.observeTeamChanges();
				this.observeWindowChanges();
				this.observeIncrementingRounds();
				this.mqService.publishEncounterCommand(this.encounterService.encounterId, this.encounterService.version + 1,
						EncounterCommandType.TEAMS_CHANGE, this.encounterService.teamsData);
				this.setReady(true);
			}
		});
	}

	public unInit(): void {
		this.concurrentSubs.unsubscribe();
		super.unInit();
		console.log('encounterConcurrencyService.unInit()');
	}

	private observeEncounterMqMessages(): void {
		this.concurrentSubs.add(this.mqService.getEncounterMessages(this.encounterService.encounterId).subscribe((message: EncounterCommandMessage) => {
			console.log(message);
			// if (message.body.version > this.encounterService.version) {
			if (true) { // versioning currently causing more problems than it fixes
				this.doEncounterCommand(message);
				this.encounterService.version = message.body.version;
			}
		}));
	}

	private observeAllPlayerChanges(): void {
		for (let player of this.encounterService.players) {
			this.observePlayerChanges(player);
		}
	}

	private observePlayerChanges(player: Player): void {
		this.concurrentSubs.add(player.changeObservable.subscribe(() => {
			this.sendEncounterCommand(EncounterCommandType.PLAYER_UPDATE, player.serialize());
		}));
	}

	private observeLightSourceChanges(): void {
		this.concurrentSubs.add(this.lightService.lightSourcesChangeObservable.subscribe(() => {
			this.sendEncounterCommand(EncounterCommandType.LIGHT_SOURCE, this.lightService.getSerializedState());
		}));
	}

	private observeNotationChanges(): void {
		this.concurrentSubs.add(this.notationService.notationsChangeObservable.subscribe((notation) => {
			this.sendEncounterCommand(EncounterCommandType.NOTATION_UPDATE, notation);
		}));

		this.concurrentSubs.add(this.notationService.ephemerailNotationChangeObservable.subscribe(() => {
			const ephemeralNotation = this.notationService.ephemeralNotationMap.get(this.userProfileService.userId);
			this.sendEncounterCommand(EncounterCommandType.EPHEMERAL_NOTATION, ephemeralNotation);
		}));
	}

	private observerWallChanges(): void {
		this.concurrentSubs.add(this.wallService.wallChangeEvent.subscribe(() => {
			this.sendEncounterCommand(EncounterCommandType.WALL_CHANGE, this.wallService.wallData);
		}));
	}

	private observerDoorChanges(): void {
		this.concurrentSubs.add(this.wallService.doorChangeEvent.subscribe(() => {
			this.sendEncounterCommand(EncounterCommandType.DOOR_CHANGE, this.wallService.doorData);
		}));
	}

	private observeWindowChanges(): void {
		this.concurrentSubs.add(this.wallService.windowChangeEvent.subscribe(() => {
			this.sendEncounterCommand(EncounterCommandType.WINDOW_CHANGE, this.wallService.windowData);
		}));
	}

	private observeConfigChanges(): void {
		this.concurrentSubs.add(this.encounterService.configChangeObservable.subscribe(() => {
			this.sendEncounterCommand(EncounterCommandType.SETTINGS_CHANGE, this.encounterService.getSerializedConfig());
		}));
	}

	private observeTeamChanges(): void {
		this.concurrentSubs.add(this.encounterService.teamsChangeObservable.subscribe(() => {
			this.sendEncounterCommand(EncounterCommandType.TEAMS_CHANGE, this.encounterService.teamsData);
		}));
	}

	private observeIncrementingRounds(): void {
		this.concurrentSubs.add(this.encounterService.incrementRoundObservable.subscribe(() => {
			this.sendEncounterCommand(EncounterCommandType.INCREMENT_ROUND, this.encounterService.round);
		}));
	}

	private doEncounterCommand(message: EncounterCommandMessage): void {
		switch (message.body.dataType) {
			case EncounterCommandType.PLAYER_UPDATE: {
				this.updatePlayer(message.body.data as PlayerData);

				// THIS IS A HACK, FIX THIS LATER
				this.playerService.updatePlayerLightSource(message.body.data['_id']);
				this.playerService.updatePlayerVisibility(message.body.data['_id']);
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
				if (message.body.userId !== this.userProfileService.userId) {
					this.lightService.lightSources = JSON.parse(String(message.body.data)) as Array<LightSource>;
				}
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
				if (!isUndefined(message.body.data)) {
					this.notationService.setNotation(JSON.parse(String(message.body.data)) as NotationData);
				}
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
			case EncounterCommandType.WALL_CHANGE: {
				if (message.body.userId === this.userProfileService.userId) {
					return;
				}
				this.wallService.wallData = message.body.data as Map<string, CellTarget>;
				this.wallService.updateLightAndTraverse();
				break;
			}
			case EncounterCommandType.DOOR_CHANGE: {
				if (message.body.userId === this.userProfileService.userId) {
					return;
				}
				this.wallService.doorData = message.body.data as Map<string, CellTarget>;
				this.wallService.updateLightAndTraverse();
				break;
			}
			case EncounterCommandType.WINDOW_CHANGE: {
				if (message.body.userId === this.userProfileService.userId) {
					return;
				}
				this.wallService.windowData = message.body.data as Map<string, CellTarget>;
				this.wallService.updateLightAndTraverse();
				break;
			}
			case EncounterCommandType.SETTINGS_CHANGE: {
				this.encounterService.config = message.body.data as EncounterConfigData;
				break;
			}
			case EncounterCommandType.TEAMS_CHANGE: {
				if (message.body.userId === this.userProfileService.userId) {
					return;
				}
				this.teamsService.setTeamsData(message.body.data as EncounterTeamsData);
				break;
			}
			case EncounterCommandType.INCREMENT_ROUND: {
				if (message.body.userId === this.userProfileService.userId) {
					return;
				}
				this.encounterService.round = Number(message.body.data);
				break;
			}
			case EncounterCommandType.GLOBAL_ANNOUNCEMENT: {
				this.encounterService.showGlobalAnnouncement(String(message.body.data));
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

	private sendEncounterCommand(type: EncounterCommandType, data: any): void {
		this.encounterService.saveCommand(type, data).subscribe();
		this.mqService.publishEncounterCommand(this.encounterService.encounterId, this.encounterService.version + 1, type, data);
	}
}
