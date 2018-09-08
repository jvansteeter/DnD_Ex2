import {Injectable} from '@angular/core';
import {XyPair} from '../geometry/xy-pair';
import {CellPolygonGroup} from '../shared/cell-polygon-group';
import {EncounterService} from '../../encounter/encounter.service';
import {BoardVisibilityService} from './board-visibility.service';
import {BoardTraverseService} from './board-traverse.service';
import {BoardStateService} from './board-state.service';
import {IsReadyService} from '../../utilities/services/isReady.service';
import {Player} from '../../encounter/player';
import {Polygon} from "../shared/polygon";
import {BoardLightService} from "./board-light.service";

@Injectable()
export class BoardPlayerService extends IsReadyService {

    public player_lightSource_map: Map<string, Polygon>;
    public player_visibility_map: Map<string, Polygon>;
    public player_traverse_map: Map<string, Array<number>>;

    public selectedPlayerIds: Set<string>;
    public hoveredPlayerId = '';

    public playerToSyncInit: Player;

    constructor(private encounterService: EncounterService,
                private boardVisibilityService: BoardVisibilityService,
                private boardLightService: BoardLightService,
                private boardTraverseService: BoardTraverseService,
                private boardStateService: BoardStateService) {
        super(encounterService, boardStateService, boardTraverseService, boardVisibilityService);
        this.player_lightSource_map = new Map<string, Polygon>();
        this.player_visibility_map = new Map<string, Polygon>();
        this.selectedPlayerIds = new Set<string>();
        this.player_traverse_map = new Map<string, Array<number>>();
        this.init();
    }

    public init(): void {
        const sub = this.dependenciesReady().subscribe((isReady: boolean) => {
            if (isReady) {
                this.updateAllPlayerVisibility();
                this.updateAllPlayerTraverse();
                sub.unsubscribe();
                this.setReady(true);
            }
        })
    }

    public addPlayer(player: Player) {
        this.encounterService.addPlayer(player);
        this.updatePlayerTraverse(player.id);
        this.updatePlayerVisibility(player.id);
    }

    public removePlayer(player: Player) {
        this.encounterService.removePlayer(player);
        this.removePlayerVisibility(player.id);
        this.removePlayerTraverse(player.id);
    }

    public movePlayer(id: string, location: XyPair) {
    }

    /*********************************************************************************************************************************************
     * LIGHT SOURCE
     *********************************************************************************************************************************************/
    public updateAllPlayerLightSource() {

    }

    public removePlayerLightSource(playerId: string) {

    }

    public updatePlayerLightSource(playerId: string) {

    }

    /*********************************************************************************************************************************************
     * VISIBILITY
     *********************************************************************************************************************************************/
    public updateAllPlayerTraverse() {
        for (const player of this.encounterService.players) {
            this.updatePlayerTraverse(player._id);
        }
    }

    public removePlayerTraverse(id: string) {
        this.player_traverse_map.delete(id);
    }

    public updatePlayerTraverse(id: string) {
        const player = this.encounterService.getPlayerById(id);
        this.player_traverse_map.set(player._id, this.boardTraverseService.dijkstraTraverse(player.location, player.speed * 2));
    }


    /*********************************************************************************************************************************************
     * VISIBILITY
     *********************************************************************************************************************************************/
    public updateAllPlayerVisibility() {
        for (let player of this.encounterService.players) {
            this.updatePlayerVisibility(player._id);
        }
    }

    public removePlayerVisibility(id: string) {
        this.player_visibility_map.delete(id);
    }

    public updatePlayerVisibility(id: string) {
        const player = this.encounterService.getPlayerById(id);
        const playerResLocation = new XyPair(player.location.x * BoardStateService.cell_res + (BoardStateService.cell_res / 2), player.location.y * BoardStateService.cell_res + (BoardStateService.cell_res / 2));
        const visibilityPolygon = this.boardVisibilityService.raytraceVisibilityFromCell(playerResLocation, this.boardStateService.diag_visibility_ray_count);
        this.player_visibility_map.set(id, visibilityPolygon);
    }

    /*********************************************************************************************************************************************
     * INPUT CONTROL
     *********************************************************************************************************************************************/

    public syncPlayerHover(cell: XyPair) {
        this.hoveredPlayerId = '';
        for (const player of this.encounterService.players) {
            if (player.location.x === cell.x && player.location.y === cell.y) {
                this.hoveredPlayerId = player._id;
                return;
            }
        }
    }

    public handleClick(loc_cell: XyPair) {
        if (this.selectedPlayerIds.size === 1) {
            for (const player of this.encounterService.players) {
                if (player.location.x === loc_cell.x && player.location.y === loc_cell.y) {
                    this.selectedPlayerIds = new Set<string>();
                    return;
                }
            }
            for (const player of this.encounterService.players) {
                if (this.selectedPlayerIds.has(player._id)) {
                    player.location = loc_cell;

                    this.updatePlayerVisibility(player._id);
                    this.updatePlayerTraverse(player._id);
                    this.boardLightService.updateAllLightValues();

                    this.selectedPlayerIds = new Set<string>();
                }
            }

        } else {
            for (const player of this.encounterService.players) {
                if (player.location.x === loc_cell.x && player.location.y === loc_cell.y) {
                    this.selectedPlayerIds.add(player._id);
                }
            }
        }
    }

    /*********************************************************************************************************************************************
     * GET/SET
     *********************************************************************************************************************************************/

    get players(): Player[] {
        return this.encounterService.players;
    }
}
