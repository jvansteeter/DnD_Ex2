import {Injectable, OnInit} from "@angular/core";
import {PopService} from "../board/pop/pop.service";
import {BoardService} from "../board/services/board.service";
import {XyPair} from "../board/geometry/xy-pair";
import {BoardConfigService} from "../board/services/board-config.service";

@Injectable()
export class EncounterDevService {
    players = [];

    constructor(
        private bsc: BoardConfigService,
        private popService: PopService
    ) {
        this.players = [
            {
                name: 'Joe',
                hp: 10,
                maxHp: 15,
                ac: 17,
                loc_x: 6,
                loc_y: 8
            },
            {
                name: 'Mary',
                hp: 7,
                maxHp: 9,
                ac: 12,
                loc_x: 4,
                loc_y: 7
            },
            {
                name: 'Sue',
                hp: 22,
                maxHp: 25,
                ac: 18,
                loc_x: 7,
                loc_y: 9
            }];
    }

    checkForPops(loc_cell: XyPair) {
        this.popService.clearPops();
        for (const player of this.players) {
            if (player.loc_x === loc_cell.x && player.loc_y === loc_cell.y) {
                const x = (loc_cell.x + 1) * this.bsc.cell_res + this.bsc.mapOffsetLeft;
                const y = (loc_cell.y) * this.bsc.cell_res  + this.bsc.mapOffsetTop;
                this.popService.addPlayerPop(x, y, player);
            }
        }
    }
}