import {Injectable} from '@angular/core';
import {PopService} from '../board/pop/pop.service';
import {BoardStateService} from '../board/services/board-state.service';
import {Player} from './player';
import {EncounterService} from './encounter.service';
import {EncounterRepository} from '../repositories/encounter.repository';
import {EncounterState} from './encounter.state';
import {BoardTraverseService} from '../board/services/board-traverse.service';
import {LightValue} from '../board/shared/enum/light-value';
import {BoardVisibilityService} from '../board/services/board-visibility.service';
import {MqService} from '../mq/mq.service';
import { PlayerData } from '../../../../shared/types/encounter/player.data';

@Injectable()
export class EncounterDevService extends EncounterService {
    players: Player[] = [];

    constructor(
        boardStateService: BoardStateService,
        encounterRepo: EncounterRepository,
    ) {
        super(
            boardStateService,
            encounterRepo
        );

        // manually instate the encounterState for dev mode
        this.encounterState = new EncounterState({
            _id: undefined,
	          version: 0,
            label: 'Dev Encounter',
            date: new Date(),
            campaignId: 'dev',
            gameMasters: [],
            players: [],
            cell_res: 50,
            mapDimX: 50,
            mapDimY: 50,
            map_enabled: false,
            wallData: {},
            playerWallsEnabled: true,
            lightSourceData: {},
            lightEnabled: false,
            ambientLight: {} as LightValue,
	          playerIds: [],
        });
    }

    public init_players() {
        // let player = new Player({
	      //   name:'Joe',
	      //   hp: 10,
	      //   maxHp: 15,
	      //   speed: 6,
	      //   tokenUrl: 'resources/images/player-tokens/human fighter 1.png'
        // } as PlayerData);
        let player = new Player({
		        _id: 'player1',
		        encounterId: 'test encounter',
		        characterData: {
			          _id: 'test character',
				        label: 'Joe',
				        creatorUserId: 'developer',
				        tokenUrl: 'resources/images/player-tokens/human fighter 1.png',
				        characterSheetId: 'charcterSheet',
				        values: {
			          	  Name : 'Joe',
				            Speed: 6,
						        Health: {
					              current: 10,
								        max: 15
						        }
				        }
		        },
	          initiative: 1,
		        location: {
			          x: 0,
				        y: 0,
		        }
        });
        player._id = String(window.crypto.getRandomValues(new Uint32Array(1))[0]);
        player.addAction('Longsword:', '+4 Attack, 1d10 + 5');
        player.addAction('Crossbow:', ' +2 Attack,  1d6 + 1');
        this.players.push(player);

        // player = new Player({
	      //   name: 'Sue',
	      //   hp: 753,
	      //   maxHp: 1235,
	      //   speed: 29,
	      //   location: {
	      //   	x: 2,
		    //     y: 3
	      //   },
	      //   tokenUrl: 'resources/images/player-tokens/human handmaid 2.png'
        // } as PlayerData);
		    player = new Player({
				    _id: 'player2',
				    encounterId: 'test encounter',
				    characterData: {
						    _id: 'test character2',
						    label: 'Sue',
						    creatorUserId: 'developer',
						    tokenUrl: 'resources/images/player-tokens/human handmaid 2.png',
						    characterSheetId: 'charcterSheet',
						    values: {
						    	  Name: 'Sue',
								    Speed: 6,
								    Health: {
										    current: 753,
										    max: 1235
								    }
						    }
				    },
			      initiative: 20,
				    location: {
						    x: 2,
						    y: 3,
				    }
		    });
        player._id = String(window.crypto.getRandomValues(new Uint32Array(1))[0]);
        player.addAction('Divine Judgement:', 'Rewrite the DM\'s will');
        player.addAction('Gaze of the Deep One:', 'Kill all living creatures, no saves, no escape');
        player.addAction('Disco Fever:', 'They can tell by the way you use your walk ...');
        this.players.push(player);
    }
}