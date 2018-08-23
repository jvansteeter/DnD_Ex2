import {Injectable} from '@angular/core';
import {Player} from './player';
import {EncounterService} from './encounter.service';
import {EncounterRepository} from '../repositories/encounter.repository';
import {EncounterState} from './encounter.state';
import {LightValue} from '../board/shared/enum/light-value';

@Injectable()
export class EncounterDevService extends EncounterService {
    constructor(
        encounterRepo: EncounterRepository,
    ) {
        super(
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
            mapDimX: 10,
            mapDimY: 8,
            map_enabled: false,
            wallData: {},
            playerWallsEnabled: true,
            lightSourceData: {},
            lightEnabled: false,
            ambientLight: {} as LightValue,
	          playerIds: [],
	          isOpen: true,
	          mapUrl: 'resources/images/maps/shack.jpg'
        });
        this.setReady(true);
    }

    public init_players() {
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
        this.addPlayer(player);

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
        this.addPlayer(player);
    }
}