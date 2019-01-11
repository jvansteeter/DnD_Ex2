import {Injectable} from '@angular/core';
import {XyPair} from '../../../../../shared/types/encounter/board/xy-pair';
import {EncounterService} from '../../encounter/encounter.service';
import {BoardVisibilityService} from './board-visibility.service';
import {BoardTraverseService} from './board-traverse.service';
import {BoardStateService} from './board-state.service';
import {IsReadyService} from '../../utilities/services/isReady.service';
import {Player} from '../../encounter/player';
import {BoardLightService} from "./board-light.service";
import {LightSource} from "../map-objects/light-source";
import { isNullOrUndefined, isUndefined } from 'util';
import {RightsService} from "../../data-services/rights.service";
import {GeometryStatics} from "../statics/geometry-statics";
import {UserProfileService} from "../../data-services/userProfile.service";

@Injectable()
export class BoardPlayerService extends IsReadyService {

    public player_lightSource_map: Map<string, LightSource> = new Map<string, LightSource>();
    public player_visibility_map: Map<string, Array<XyPair>> = new Map<string, Array<XyPair>>();
    public player_traverse_map: Map<string, Array<number>> = new Map<string, Array<number>>();

    public selectedPlayerId: string;
    public hoveredPlayerId: string;

    public playerToSyncInit: Player;

    constructor(private encounterService: EncounterService,
                private boardVisibilityService: BoardVisibilityService,
                private boardLightService: BoardLightService,
                private boardTraverseService: BoardTraverseService,
                private rightsService: RightsService,
                private userProfileService: UserProfileService,
                private boardStateService: BoardStateService) {
        super(encounterService, boardStateService, boardTraverseService, boardVisibilityService);
        this.init();
    }

    public init(): void {
        this.player_lightSource_map = new Map<string, LightSource>();
        this.player_visibility_map = new Map<string, Array<XyPair>>();
        this.player_traverse_map = new Map<string, Array<number>>();

        this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
            if (isReady && !this.isReady()) {
                console.log('boardPlayerService.init() -> isReady');
                this.setReady(true);
            }
        })
    }

    public unInit(): void {
        console.log('boardPlayerService.unInit()');
        this.setReady(false);
        delete this.player_traverse_map;
        delete this.player_visibility_map;
        delete this.player_lightSource_map;
    }

    public addPlayer(player: Player) {
        this.encounterService.addPlayer(player);
        this.updatePlayerTraverse(player._id);
        this.updatePlayerVisibility(player._id);
        this.updatePlayerLightSource(player._id);
    }

    public removePlayer(player: Player) {
        this.encounterService.removePlayer(player);
        this.removePlayerVisibility(player._id);
        this.removePlayerTraverse(player._id);
        this.removePlayerLightSource(player._id);
    }

    public movePlayer(id: string, location: XyPair) {
    }

    /*********************************************************************************************************************************************
     * LIGHT SOURCE
     *********************************************************************************************************************************************/
    public updateAllPlayerLightSource() {
        console.log('\tboardPlayerService: updateAllPlayerLightSource()');
        for (const player of this.encounterService.players) {
            this.updatePlayerLightSource(player._id);
        }
    }

    public removePlayerLightSource(playerId: string) {
        this.player_lightSource_map.delete(playerId);
    }

    public updatePlayerLightSource(playerId: string) {
        console.log('\t\tboardPlayerService: updatePlayerLightSource()');
        const player = this.encounterService.getPlayerById(playerId);
        let playerVision = player.characterData.values['Vision'];
        if (isUndefined(playerVision)) {
            playerVision = 0;
        }
        const playerLightSource = new LightSource(player.location, playerVision / 2, playerVision);

        const light_polys = this.boardLightService.generateLightPolygons(playerLightSource);
        playerLightSource.dim_polygon = light_polys.dim_poly;
        playerLightSource.bright_polygon = light_polys.bright_poly;
        this.player_lightSource_map.set(player.id, playerLightSource);
    }

    /*********************************************************************************************************************************************
     * TRAVERSE
     *********************************************************************************************************************************************/
    public updateAllPlayerTraverse() {
        console.log('\tboardPlayerService: updateAllPlayerTraverse()');
        for (const player of this.encounterService.players) {
            this.updatePlayerTraverse(player._id);
        }
    }

    public removePlayerTraverse(id: string) {
        this.player_traverse_map.delete(id);
    }

    public updatePlayerTraverse(id: string) {
        console.log('\t\tboardPlayerService: updatePlayerTraverse');
        const player = this.encounterService.getPlayerById(id);
        this.player_traverse_map.set(player._id, this.boardTraverseService.dijkstraTraverse(player.location, player.speed * 2));
    }


    /*********************************************************************************************************************************************
     * VISIBILITY
     *********************************************************************************************************************************************/
    public updateAllPlayerVisibility() {
        console.log('\tboardPlayerService: updateAllPlayerVisibility()');
        for (let player of this.encounterService.players) {
            this.updatePlayerVisibility(player._id);
        }
    }

    public removePlayerVisibility(id: string) {
        this.player_visibility_map.delete(id);
    }

    public updatePlayerVisibility(id: string) {
        console.log('\t\tboardPlayerService: updatePlayerVisibility');
        const player = this.encounterService.getPlayerById(id);
        const playerPixelLocation = new XyPair(player.location.x * BoardStateService.cell_res + (BoardStateService.cell_res / 2), player.location.y * BoardStateService.cell_res + (BoardStateService.cell_res / 2));

        let playerVision = player.characterData.values['Vision'];
        if (isUndefined(playerVision)) {
            playerVision = 0;
        }

        const vis_pixel_range = playerVision * BoardStateService.cell_res + BoardStateService.cell_res / 2;
        const vis_range_circle = GeometryStatics.BresenhamCircle(playerPixelLocation, vis_pixel_range);
        const visibilityPolygon = this.boardVisibilityService.raytraceVisibilityFromCell(playerPixelLocation, this.boardStateService.diag_visibility_ray_count, ...this.boardLightService.cropCircle(vis_range_circle));
        this.player_visibility_map.set(id, visibilityPolygon);
    }

    /*********************************************************************************************************************************************
     * TOKEN VISIBILITY
     *********************************************************************************************************************************************/
    public tryTogglePlayerVisibility(player: Player) {
        if (this.rightsService.isMyPlayer(player) || this.rightsService.isEncounterGM()){
            player.isVisible = !player.isVisible;
        }
    }

    public tokenHasLOSToSomeUserToken(target: Player): boolean {
        let userTokens: Array<Player> = new Array<Player>();
        for (let player of this.players) {
            if (player.userId === this.userProfileService.userId) {
                userTokens.push(player);
            }
        }

        if (userTokens.length === 0) {
            return false;
        }

        for (let userToken of userTokens) {
            if (this.boardVisibilityService.cellHasLOSToCell(target.location, userToken.location)) {
                return true;
            }
        }
        return false;
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

    public toggleSelectPlayer(player: Player) {
        if (this.selectedPlayerId === null) {
            this.selectedPlayerId = player._id;
            return;
        }

        if (this.selectedPlayerId === player._id) {
            this.selectedPlayerId = null;
            return;
        }

        this.selectedPlayerId = player._id;
    }

    public playerService_handleClick(loc_cell: XyPair) {
        if (this.boardStateService.ctrlDown) {
            // player visibility toggle mode
            for (const player of this.encounterService.players) {
                // ... search through the players to see if a player was clicked on ...
	              if (isNullOrUndefined(player.location) || isNullOrUndefined(loc_cell)) {
	              	  return;
	              }
                if (player.location.x === loc_cell.x && player.location.y === loc_cell.y) {
                    this.tryTogglePlayerVisibility(player);
                }
            }
        } else {
            // player move/select mode
            if (this.selectedPlayerId !== null && !isUndefined(this.selectedPlayerId)) {
                // a player is currently selected ...
                for (const player of this.encounterService.players) {
                    // ... and there is a player on the click location ...
		                if (isNullOrUndefined(player.location) || isNullOrUndefined(loc_cell)) {
			                  return;
		                }
                    if (player.location.x === loc_cell.x && player.location.y === loc_cell.y) {
                        // ... unselect the player and return
                        this.selectedPlayerId = null;
                        return;
                    }
                }

                const selectedPlayer = this.encounterService.getPlayerById(this.selectedPlayerId);
                selectedPlayer.location = loc_cell;
                this.updatePlayerVisibility(selectedPlayer._id);
                this.updatePlayerTraverse(selectedPlayer._id);
                this.updatePlayerLightSource(selectedPlayer._id);
                this.selectedPlayerId = null;

            } else {
                // there is no player selected ...
                for (const player of this.encounterService.players) {
                    // ... search through the players to see if a player was selected ...
	                  if (isNullOrUndefined(player) || isNullOrUndefined(player.location) || isNullOrUndefined(loc_cell)) {
	                  	  return;
	                  }
                    if (player.location.x === loc_cell.x && player.location.y === loc_cell.y) {
                        // ... select the player and return
                        if (player.isVisible) {
                            this.toggleSelectPlayer(player);
                            return;
                        } else {
                            if (this.rightsService.isEncounterGM() || this.rightsService.isMyPlayer(player)) {
                                this.toggleSelectPlayer(player);
                            }
                        }

                    }
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
