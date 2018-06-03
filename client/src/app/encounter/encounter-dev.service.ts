import {Injectable, OnInit} from "@angular/core";
import {PopService} from "../board/pop/pop.service";
import {BoardService} from "../board/services/board.service";
import {XyPair} from "../board/geometry/xy-pair";
import {BoardConfigService} from "../board/services/board-config.service";
import {Player} from "./player";

@Injectable()
export class EncounterDevService {
    players: Player[] = [];
    playerSelected = false;

    constructor(
        private bsc: BoardConfigService,
        private popService: PopService
    ) {
        let player = new Player('Joe', 10, 15, 17,  9, 8, 'resources/images/player-tokens/human fighter 1.png');
        player.addAction('Longsword:', '+4 Attack, 1d10 + 5');
        player.addAction('Crossbow:', ' +2 Attack,  1d6 + 1');
        this.players.push(player);

        player = new Player('Mary', 7, 9, 12,  4, 7, 'resources/images/player-tokens/human granny 1.png');
        player.addAction('Fireball:', 'DC 18 Dexterity, 6d10, half on success');
        player.addAction('Acid Cone:', '+4 Attack, +2 1d8 + 3, 30ft cone');
        player.addAction('Read Thoughts:', 'DC 15 Wisdom, see manual');
        this.players.push(player);

        player = new Player('Sue', 753, 1235, 29,  14, 3, 'resources/images/player-tokens/human handmaid 2.png');
        player.addAction('Divine Judgement:', 'Rewrite the DM\'s will');
        player.addAction('Gaze of the Deep One:', 'Kill all living creatures, no saves, no escape');
        player.addAction('Disco Fever:', 'They can tell by the way you use your walk ...');
        this.players.push(player);
    }

    checkForPops(loc_cell: XyPair, pop_origin: XyPair) {
        this.popService.clearPops();
        if (this.bsc.do_pops) {
            for (const player of this.players) {
                if (player.loc.x === loc_cell.x && player.loc.y === loc_cell.y) {
                    const x = (loc_cell.x + 1) * this.bsc.cell_res;
                    const y = (loc_cell.y) * this.bsc.cell_res;

                    this.popService.addPlayerPop(pop_origin.x, pop_origin.y, player);
                }
            }
        }
    }

    handleClick(loc_cell: XyPair) {
        if (this.playerSelected) {
            for (const player of this.players) {
                if (player.loc.x === loc_cell.x && player.loc.y === loc_cell.y) {
                    this.deselectAllPlayers();
                    return;
                }
            }

            for (const player of this.players) {
                if (player.isSelected) {
                    player.loc = loc_cell;
                    this.deselectAllPlayers();
                }
            }
        } else {
            for (const player of this.players) {
                if (player.loc.x === loc_cell.x && player.loc.y === loc_cell.y) {
                    player.isSelected = true;
                    this.playerSelected = true;
                }
            }
        }

    }

    deselectAllPlayers() {
        for (const player of this.players) {
            player.isSelected = false;
        }
        this.playerSelected = false;
    }
}