import {Injectable} from '@angular/core';
import {XyPair} from '../geometry/xy-pair';
import {CellPolygonGroup} from '../shared/cell-polygon-group';
import {EncounterService} from '../../encounter/encounter.service';
import {BoardVisibilityService} from './board-visibility.service';
import {BoardTraverseService} from './board-traverse.service';
import {BoardStateService} from './board-state.service';
import {PopService} from '../pop/pop.service';
import { IsReadyService } from '../../utilities/services/isReady.service';

@Injectable()
export class BoardPlayerService extends IsReadyService {
    public player_visibility_map: Map<string, CellPolygonGroup>;
    public player_traverse_map_near: Map<string, Array<XyPair>>;
    public player_traverse_map_far: Map<string, Array<XyPair>>;
    public selectedPlayerIds: Set<string>;
    public hoveredPlayerId = '';

    constructor(private popService: PopService,
                private encounterService: EncounterService,
                private boardVisibilityService: BoardVisibilityService,
                private boardTraverseService: BoardTraverseService,
                private boardStateService: BoardStateService) {
    	super(encounterService);
        this.player_visibility_map = new Map<string, CellPolygonGroup>();
        this.selectedPlayerIds = new Set<string>();
        this.player_traverse_map_near = new Map<string, Array<XyPair>>();
        this.player_traverse_map_far = new Map<string, Array<XyPair>>();
        this.init();
    }

    public init(): void {
    	this.dependenciesReady().subscribe((isReady: boolean) => {
    		if (isReady) {
			    this.updateAllPlayerVisibility();
			    this.updateAllPlayerTraverse();
			    this.setReady(true);
		    }
	    })
    }

    public dev_mode_init() {
        this.encounterService.init_players();
        this.updateAllPlayerVisibility();
        this.updateAllPlayerTraverse();
    }

    public addPlayer() {
    }

    public removePlayer() {
    }

    public movePlayer(id: string, location: XyPair) {
    }

    public updateAllPlayerVisibility() {
        for (let player of this.encounterService.players) {
            this.updatePlayerVisibility(player._id, new CellPolygonGroup(this.boardVisibilityService.cellQuadsVisibleFromCell(player.location)));
        }
    }
    
    public updateAllPlayerTraverse (){
        for (const player of this.encounterService.players) {
            this.player_traverse_map_near.set(player._id, this.boardTraverseService.calcTraversableCells(player.location, player.speed));
            this.player_traverse_map_far.set(player._id, this.boardTraverseService.calcTraversableCells(player.location, player.speed * 2));
        }
    }

    public updatePlayerTraverse (id: string) {
        const player = this.encounterService.getPlayerById(id);
        this.player_traverse_map_near.set(player._id, this.boardTraverseService.calcTraversableCells(player.location, player.speed));
        this.player_traverse_map_far.set(player._id, this.boardTraverseService.calcTraversableCells(player.location, player.speed * 2));
    }

    public updatePlayerVisibility(id: string, visibilityPolygon?: CellPolygonGroup) {
        if (!!visibilityPolygon) {
            this.player_visibility_map.set(id, visibilityPolygon);
        } else {
            const player = this.encounterService.getPlayerById(id);
            this.player_visibility_map.set(id, new CellPolygonGroup(this.boardVisibilityService.cellQuadsVisibleFromCell(player.location)));
        }
    }

    public syncPlayerHover(cell: XyPair) {
        this.hoveredPlayerId = '';
        for (const player of this.encounterService.players) {
            if (player.location.x === cell.x && player.location.y === cell.y) {
                this.hoveredPlayerId = player._id;
                return;
            }
        }
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
                    this.updatePlayerVisibility(player._id, this.boardVisibilityService.cellPolygonVisibleFromCell(player.location));
                    this.updatePlayerTraverse(player._id);
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

}
