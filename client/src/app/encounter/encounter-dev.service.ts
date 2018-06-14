import {Injectable, OnInit} from '@angular/core';
import {PopService} from '../board/pop/pop.service';
import {XyPair} from '../board/geometry/xy-pair';
import {BoardStateService} from '../board/services/board-state.service';
import {Player} from './player';
import {BoardWallService} from '../board/services/board-wall.service';
import {EncounterService} from './encounter.service';
import {EncounterRepository} from '../repositories/encounter.repository';
import {EncounterState} from './encounter.state';
import {BoardTraverseService} from '../board/services/board-traverse.service';

@Injectable()
export class EncounterDevService extends EncounterService {
    players: Player[] = [];

    constructor(
        boardStateService: BoardStateService,
        popService: PopService,
        boardTraverseService: BoardTraverseService,
        encounterRepo: EncounterRepository
    ) {
        super(
            boardStateService,
            popService,
            boardTraverseService,
            encounterRepo
        );

        // manually instate the encounterState for dev mode
        this.encounterState = new EncounterState();
        this.encounterState.players = [];

        let player = new Player('Joe', 10, 15, 17, 6, 5, 'resources/images/player-tokens/human fighter 1.png');
        player._id = window.crypto.getRandomValues(new Uint32Array(1))[0];
        player.addAction('Longsword:', '+4 Attack, 1d10 + 5');
        player.addAction('Crossbow:', ' +2 Attack,  1d6 + 1');
        this.players.push(player);

        player = new Player('Mary', 7, 9, 12, 4, 6, 'resources/images/player-tokens/human granny 1.png');
        player._id = window.crypto.getRandomValues(new Uint32Array(1))[0];
        player.addAction('Fireball:', 'DC 18 Dexterity, 6d10, half on success');
        player.addAction('Acid Cone:', '+4 Attack, +2 1d8 + 3, 30ft cone');
        player.addAction('Read Thoughts:', 'DC 15 Wisdom, see manual');
        this.players.push(player);

        player = new Player('Sue', 753, 1235, 29, 2, 3, 'resources/images/player-tokens/human handmaid 2.png');
        player._id = window.crypto.getRandomValues(new Uint32Array(1))[0];
        player.addAction('Divine Judgement:', 'Rewrite the DM\'s will');
        player.addAction('Gaze of the Deep One:', 'Kill all living creatures, no saves, no escape');
        player.addAction('Disco Fever:', 'They can tell by the way you use your walk ...');
        this.players.push(player);

        player = new Player('Stevie', 2, 36, 17, 6, 3, 'resources/images/player-tokens/human fatty 1.png');
        player._id = window.crypto.getRandomValues(new Uint32Array(1))[0];
        player.addAction('Longsword:', '+4 Attack, 1d10 + 5');
        player.addAction('Crossbow:', ' +2 Attack,  1d6 + 1');
        this.players.push(player);
    }
}