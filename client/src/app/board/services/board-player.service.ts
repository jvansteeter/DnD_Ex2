import {Injectable} from '@angular/core';
import {XyPair} from '../geometry/xy-pair';
import {CellPolygonGroup} from '../shared/cell-polygon-group';
import {EncounterService} from '../../encounter/encounter.service';
import {BoardVisibilityService} from './board-visibility.service';
import {BoardTraverseService} from './board-traverse.service';
import {BoardStateService} from './board-state.service';
import {PopService} from '../pop/pop.service';

@Injectable()
export class BoardPlayerService {

    public selectedPlayerId = '';

    public player_visibility_map: Map<string, CellPolygonGroup>;
    private player_traversibility_maps: Map<string, Array<XyPair>>;

    constructor(
        private popService: PopService,
        private encounterService: EncounterService,
        private boardVisibilityService: BoardVisibilityService,
        private boardTraverseService: BoardTraverseService,
        private boardStateService: BoardStateService
    ) {
        this.player_visibility_map = new Map<string, CellPolygonGroup>();
        this.player_traversibility_maps = new Map<string, Array<XyPair>>();
    }

    public dev_mode_init() {
        this.encounterService.init_players();
        for (let player of this.encounterService.players) {
            this.updatePlayerVisibility(player._id, new CellPolygonGroup(this.boardVisibilityService.cellQuadsVisibleFromCell(player.location)));
        }
    }

    public addPlayer() {
    }

    public removePlayer() {
    }

    public movePlayer(id: string, location: XyPair) {
    }

    public updatePlayerVisibility(id: string, visibilityPolygon: CellPolygonGroup) {
        this.player_visibility_map.set(id, visibilityPolygon);
    }

    public syncPlayerHover(cell: XyPair) {

    }

    public checkForPops(loc_cell: XyPair, pop_origin: XyPair) {
        if (this.boardStateService.do_pops) {
            for (const player of this.encounterService.players) {
                if (player.location.x === loc_cell.x && player.location.y === loc_cell.y) {
                    if (this.popService.popIsActive(player._id)) {
                        this.popService.clearPlayerPop(player._id);
                    } else {
                        const x = (loc_cell.x + 1) * BoardStateService.cell_res;
                        const y = (loc_cell.y) * BoardStateService.cell_res;
                        this.popService.addPlayerPop(pop_origin.x, pop_origin.y, player);
                    }
                }
            }
        }
    }

    public handleClick(loc_cell: XyPair) {
        if (this.encounterService.playerSelected) {
            for (const player of this.encounterService.players) {
                if (player.location.x === loc_cell.x && player.location.y === loc_cell.y) {
                    this.encounterService.deselectAllPlayers();
                    return;
                }
            }

            for (const player of this.encounterService.players) {
                if (player.isSelected) {
                    player.location = loc_cell;
                    this.updatePlayerVisibility(player._id, this.boardVisibilityService.cellPolygonVisibleFromCell(player.location));
                    this.encounterService.deselectAllPlayers();
                }
            }
        } else {
            for (const player of this.encounterService.players) {
                if (player.location.x === loc_cell.x && player.location.y === loc_cell.y) {

                    // player.traversableCells_near = this.boardTraverseService.calcTraversableCells(player.location, player.speed);
                    // player.traversableCells_far = this.boardTraverseService.calcTraversableCells(player.location, player.speed * 2);

                    player.isSelected = true;
                    this.encounterService.playerSelected = true;
                }
            }
        }
    }

}
