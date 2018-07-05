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

@Injectable()
export class EncounterDevService extends EncounterService {
    players: Player[] = [];

    constructor(
        boardStateService: BoardStateService,
        encounterRepo: EncounterRepository,
        mqService: MqService
    ) {
        super(
            boardStateService,
            encounterRepo,
            mqService
        );

        // manually instate the encounterState for dev mode
        this.encounterState = new EncounterState({
            _id: undefined,
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
        });
        this.encounterState.players = [];
    }

    public init_players() {
        let player = new Player('Joe', 10, 15, 17, 6, 5, 'resources/images/player-tokens/human fighter 1.png');
        player._id = window.crypto.getRandomValues(new Uint32Array(1))[0];
        player.addAction('Longsword:', '+4 Attack, 1d10 + 5');
        player.addAction('Crossbow:', ' +2 Attack,  1d6 + 1');
        this.players.push(player);

        player = new Player('Sue', 753, 1235, 29, 2, 3, 'resources/images/player-tokens/human handmaid 2.png');
        player._id = window.crypto.getRandomValues(new Uint32Array(1))[0];
        player.addAction('Divine Judgement:', 'Rewrite the DM\'s will');
        player.addAction('Gaze of the Deep One:', 'Kill all living creatures, no saves, no escape');
        player.addAction('Disco Fever:', 'They can tell by the way you use your walk ...');
        this.players.push(player);
    }
}