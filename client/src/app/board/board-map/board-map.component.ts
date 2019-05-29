import {
    Component,
    ViewChild,
    ElementRef,
    OnInit,
    HostListener,
    AfterViewInit, OnDestroy,
} from '@angular/core';
import {BoardCanvasService} from "../services/board-canvas.service";
import {BoardStateService} from "../services/board-state.service";
import {BoardWallService} from "../services/board-wall.service";
import {XyPair} from '../../../../../shared/types/encounter/board/xy-pair';
import {BoardTransformService} from '../services/board-transform.service';
import {isNullOrUndefined} from "util";
import {BoardMode} from '../shared/enum/board-mode';
import {CellRegion} from '../shared/enum/cell-region';
import {ViewMode} from '../shared/enum/view-mode';
import {BoardLightService} from '../services/board-light.service';
import {BoardPlayerService} from '../services/board-player.service';
import {BoardNotationService} from '../services/board-notation-service';
import {EncounterService} from '../../encounter/encounter.service';
import {PopService} from '../pop/pop.service';
import {LightSource} from "../map-objects/light-source";
import {Player} from "../../encounter/player";
import {MatDialog} from "@angular/material";
import {TempPlayerInitDialogComponent} from "../dialogs/temp-player-init-dialog/temp-player-init-dialog.component";
import {BoardControllerMode} from "../shared/enum/board-controller-mode";
import { RightsService } from '../../data-services/rights.service';
import {BoardTeamsService} from "../services/board-teams.service";
import { RendererConsolidationService } from '../renderer/renderer-consolidation.service';
import { RendererComponent } from '../renderer/render-component.interface';
import { RuleSetService } from '../../data-services/ruleSet.service';
import { RulesConfigService } from '../../data-services/rules-config.service';
import { BoardStealthService } from '../services/board-stealth.service';
import { RuleModuleAspects } from '../../../../../shared/predefined-aspects.enum';


@Component({
    selector: 'board-map',
    templateUrl: 'board-map.component.html',
    styleUrls: ['board-map.component.scss']
})
export class BoardMapComponent implements OnInit, AfterViewInit, OnDestroy, RendererComponent {
    @ViewChild('mapContainer', {static: false}) mapContainer: ElementRef;
    public RuleModuleAspects = RuleModuleAspects;

    constructor(private boardCanvasService: BoardCanvasService,
                private boardStateService: BoardStateService,
                private boardTransformService: BoardTransformService,
                private boardWallService: BoardWallService,
                private boardLightService: BoardLightService,
                private boardPlayerService: BoardPlayerService,
                private boardNotationService: BoardNotationService,
                private encounterService: EncounterService,
                private dialog: MatDialog,
                private popService: PopService,
                private boardTeamsService: BoardTeamsService,
                public rightsService: RightsService,
                private renderConService: RendererConsolidationService,
                private ruleSetService: RuleSetService,
                public rulesConfigService: RulesConfigService,
                private stealthService: BoardStealthService,
                ) {
    }

    render = () => {
        this.syncMapContainerDims();
    };

    ngOnInit(): void {
        this.renderConService.registerRenderer(this);
        this.renderConService.start();
        this.rulesConfigService.setRuleSetService(this.ruleSetService);
        this.rulesConfigService.setRuleSetRuleMode();
    }

    ngAfterViewInit(): void {
        this.boardCanvasService.mapContainerNativeElement = this.mapContainer.nativeElement;
    }

    ngOnDestroy(): void {
        this.renderConService.deregisterRenderer(this);
        this.renderConService.stop();
    }

    /****************************************************************************************************************
     * Initiative Functions
     ****************************************************************************************************************/
    public showInitCoin(player: Player): boolean {
    	  if (this.rightsService.isEncounterGM() || this.rightsService.isMyPlayer(player) || this.boardTeamsService.userSharesTeamWithPlayer(player)) {
    	  	return true;
	      }
    	  else {
		      let hasLineOfSight = player.isVisible && this.boardPlayerService.tokenHasLOSToSomeUserToken(player);
		      if (this.rulesConfigService.hasHiddenAndSneaking) {
			      hasLineOfSight = hasLineOfSight && this.stealthService.userCanSeeHiddenPlayer(player);
		      }
		      return hasLineOfSight;
	      }
    }

    private boardMap_handleInitBadgeMouseUp(event: MouseEvent, player: Player) {
        switch(event.which) {
            case 1:
                this.boardMap_handleInitDialog(player);
                break;
            case 2:
                break;
            case 3:
                break;
        }
    }

    private boardMap_handleInitIconMouseUp(event: MouseEvent, player: Player) {
        switch(event.which) {
            case 1:
                if (this.boardStateService.ctrlDown) {
                    this.boardPlayerService.tryTogglePlayerVisibility(player);
                } else {
                    this.boardPlayerService.toggleSelectPlayer(player);
                }
                break;
            case 2:
                break;
            case 3:
            	  if (this.popService.popIsActive(player.id)) {
            	  	this.popService.clearPlayerPop(player.id);
	              }
            	  else {
		              this.popService.addPlayerPop(event.x + 50, event.y, player);
	              }
                break;
        }
    }

    private boardMap_handleInitDialog(player: Player) {
        this.boardPlayerService.playerToSyncInit = player;
        this.dialog.open(TempPlayerInitDialogComponent);
    }

    private boardMap_mouseOverInitIcon(player: Player): void {
        this.boardPlayerService.hoveredPlayerId = player._id;
    }


    /****************************************************************************************************************
     * Event Handler/Listener Functions
     ****************************************************************************************************************/
    private boardMap_mouseMove(event): void {
        const mouse_screen = new XyPair(event.clientX, event.clientY);

        if (this.boardStateService.isEditingNotation || this.boardStateService.board_controller_mode === BoardControllerMode.EPHEM_NOTATION) {
            this.boardNotationService.handleMouseMove();
        }

        if (this.boardStateService.mouseMiddleDown || (this.boardStateService.spaceDown && this.boardStateService.mouseLeftDown)) {
            this.boardStateService.mouseDrag = true;
            this.boardCanvasService.rebuild_grid_canvas = true;
            const trans_coor = this.boardTransformService.screen_to_map(event);

            const deltaX = this.boardStateService.mouse_loc_map.x - trans_coor.x;
            const deltaY = this.boardStateService.mouse_loc_map.y - trans_coor.y;

            this.boardStateService.canvasTransform_xOffset -= (deltaX * this.boardStateService.canvasTransform_scale);
            this.boardStateService.canvasTransform_yOffset -= (deltaY * this.boardStateService.canvasTransform_scale);
        }

        this.boardMap_updateMouseLocation(mouse_screen);

        this.boardPlayerService.syncPlayerHover(this.boardStateService.mouse_loc_cell);
    }

    private boardMap_handleMouseUp(event) {
        switch (event.which) {
            case 1:
                // left click
                this.boardMap_doMouseLeftUp(event);
                break;
            case 2:
                // middle click
                this.boardStateService.mouseMiddleDown = false;
                break;
            case 3:
                // right click
                this.boardMap_doMouseRightUp(event);
                break;
        }
    }

    private boardMap_handleMouseDown(event) {
        switch (event.which) {
            case 1:
                // left click
                this.boardStateService.mouseLeftDown = true;
                if (this.boardStateService.isEditingNotation) {
                    this.boardNotationService.handleMouseLeftDown(event);
                }
                break;
            case 2:
                // middle click
                this.boardStateService.mouseMiddleDown = true;
                break;
            case 3:
                // right click
                break;
        }
    }

    private boardMap_handleMouseWheel(event) {
        const scroll_scale_delta = 0.10;
        const max_scale = this.boardStateService.maxZoom;
        const min_scale = this.boardStateService.minZoom;

        const start_scale = this.boardStateService.canvasTransform_scale;

        const preferred_scale_delta = (-event.deltaY / 100) * scroll_scale_delta;
        const preferred_new_scale = start_scale + preferred_scale_delta;

        let new_scale_delta;

        if (preferred_new_scale >= max_scale) {
            new_scale_delta = start_scale - max_scale;
        } else if (preferred_new_scale <= min_scale) {
            new_scale_delta = min_scale - start_scale;
        } else {
            new_scale_delta = preferred_scale_delta;
        }

        const x_delta = -(this.boardStateService.mouse_loc_map.x * new_scale_delta);
        const y_delta = -(this.boardStateService.mouse_loc_map.y * new_scale_delta);

        this.boardStateService.canvasTransform_scale += new_scale_delta;
        this.boardStateService.canvasTransform_xOffset += x_delta;
        this.boardStateService.canvasTransform_yOffset += y_delta;
    }

    private boardMap_handleMouseLeave(event) {
        this.boardMap_clearMouseLocation();
        this.boardStateService.mouseLeftDown = false;
    }

    private boardMap_handleMouseEnter(event) {
    }

    private boardMap_handleContextMenu(event) {
        return false;
    }

    private boardMap_doMouseLeftUp(event) {
        if (this.boardStateService.isEditingNotation) {
            this.boardStateService.mouseLeftDown = false;
            this.boardStateService.mouseDrag = false;
            return;
        }

        if (!this.boardStateService.mouseDrag) {
            switch (this.boardStateService.board_view_mode) {
                case ViewMode.MASTER:
                    switch (this.boardStateService.board_edit_mode) {
                        case BoardMode.PLAYER:
                            this.boardPlayerService.playerService_handleClick(this.boardStateService.mouse_loc_cell);
                            break;
                    }
                    break;
                case ViewMode.PLAYER:
                    switch (this.boardStateService.board_edit_mode) {
                        case BoardMode.PLAYER:
                            this.boardPlayerService.playerService_handleClick(this.boardStateService.mouse_loc_cell);
                            break;
                    }
                    break;
                case ViewMode.BOARD_MAKER:
                    switch (this.boardStateService.board_edit_mode) {
                        case BoardMode.PLAYER:
                            this.boardPlayerService.playerService_handleClick(this.boardStateService.mouse_loc_cell);
                            break;
                        case BoardMode.WINDOW:
                            if (!isNullOrUndefined(this.boardStateService.mouse_cell_target)) {
                                switch (this.boardStateService.mouse_cell_target.region) {
                                    case CellRegion.TOP_EDGE:
                                        this.boardStateService.source_click_location = null;
                                        this.boardWallService.toggleWindow(this.boardStateService.mouse_cell_target);
                                        break;
                                    case CellRegion.LEFT_EDGE:
                                        this.boardStateService.source_click_location = null;
                                        this.boardWallService.toggleWindow(this.boardStateService.mouse_cell_target);
                                        break;
                                    case CellRegion.FWRD_EDGE:
                                        this.boardStateService.source_click_location = null;
                                        this.boardWallService.toggleWindow(this.boardStateService.mouse_cell_target);
                                        break;
                                    case CellRegion.BKWD_EDGE:
                                        this.boardStateService.source_click_location = null;
                                        this.boardWallService.toggleWindow(this.boardStateService.mouse_cell_target);
                                        break;
                                }
                            }
                            break;
                        case BoardMode.WALLS:
                            if (!isNullOrUndefined(this.boardStateService.mouse_cell_target)) {
                                if (!isNullOrUndefined(this.boardStateService.source_click_location)) {
                                    // MOUSE NOT DRAGGING - WALL EDIT MODE - MOUSE ON MAP - SOURCE IS DEFINED
                                    switch (this.boardStateService.mouse_cell_target.region) {
                                        case CellRegion.CORNER:
                                            this.boardWallService.fillWallsBetweenCorners(this.boardStateService.source_click_location.location, this.boardStateService.mouse_cell_target.location);
                                            this.boardStateService.source_click_location = this.boardStateService.mouse_cell_target;
                                            break;
                                        default:
                                            this.boardStateService.source_click_location = null;
                                    }
                                } else {
                                    switch (this.boardStateService.mouse_cell_target.region) {
                                        // MOUSE NOT DRAGGING - WALL EDIT MODE - MOUSE ON MAP - SOURCE IS NOT DEFINED
                                        case CellRegion.CORNER:
                                            this.boardStateService.source_click_location = this.boardStateService.mouse_cell_target;
                                            break;
                                        case CellRegion.TOP_EDGE:
                                            this.boardStateService.source_click_location = null;
                                            this.boardWallService.toggleWall(this.boardStateService.mouse_cell_target);
                                            break;
                                        case CellRegion.LEFT_EDGE:
                                            this.boardStateService.source_click_location = null;
                                            this.boardWallService.toggleWall(this.boardStateService.mouse_cell_target);
                                            break;
                                        case CellRegion.FWRD_EDGE:
                                            this.boardStateService.source_click_location = null;
                                            this.boardWallService.toggleWall(this.boardStateService.mouse_cell_target);
                                            break;
                                        case CellRegion.BKWD_EDGE:
                                            this.boardStateService.source_click_location = null;
                                            this.boardWallService.toggleWall(this.boardStateService.mouse_cell_target);
                                            break;
                                    }
                                }
                            }
                            break;
                        case BoardMode.DOORS:
                            if (!isNullOrUndefined(this.boardStateService.mouse_cell_target)) {
                                switch (this.boardStateService.mouse_cell_target.region) {
                                    case CellRegion.TOP_EDGE:
                                        this.boardWallService.toggleDoor(this.boardStateService.mouse_cell_target);
                                        break;
                                    case CellRegion.LEFT_EDGE:
                                        this.boardWallService.toggleDoor(this.boardStateService.mouse_cell_target);
                                        break;
                                    case CellRegion.FWRD_EDGE:
                                        this.boardWallService.toggleDoor(this.boardStateService.mouse_cell_target);
                                        break;
                                    case CellRegion.BKWD_EDGE:
                                        this.boardWallService.toggleDoor(this.boardStateService.mouse_cell_target);
                                        break;
                                }
                            }
                            break;
                        case BoardMode.LIGHTS:
                            if (!isNullOrUndefined(this.boardStateService.mouse_cell_target)) {
                                if (this.boardStateService.mouse_cell_target.region === CellRegion.CENTER) {
                                    this.boardLightService.toggleLightSource(new LightSource(this.boardStateService.mouse_loc_cell, 3));
                                }
                            }
                            break;
                    }
                    break;
            }
        }

        this.boardStateService.mouseLeftDown = false;
        this.boardStateService.mouseDrag = false;
    }

    private boardMap_doMouseRightUp(event) {
    	  if (isNullOrUndefined(this.boardStateService.mouse_loc_cell)) {
    	  	  return;
	      }
        this.checkForPlayerPops(
            new XyPair(this.boardStateService.mouse_loc_cell.x, this.boardStateService.mouse_loc_cell.y),
            this.boardTransformService.map_to_screen(new XyPair((this.boardStateService.mouse_loc_cell.x + 1) * BoardStateService.cell_res, ((this.boardStateService.mouse_loc_cell.y) * BoardStateService.cell_res)))
        );

        switch (this.boardStateService.board_view_mode) {
            case ViewMode.BOARD_MAKER:

                break;
            case ViewMode.PLAYER:
                break;
            case ViewMode.MASTER:
                break;
        }

        if (!isNullOrUndefined(this.boardStateService.mouse_right_cell_target)) {
            const cellTarget = this.boardStateService.mouse_right_cell_target;
            if (cellTarget.region === CellRegion.TOP_EDGE ||
                cellTarget.region === CellRegion.LEFT_EDGE ||
                cellTarget.region === CellRegion.FWRD_EDGE ||
                cellTarget.region === CellRegion.BKWD_EDGE) {
                this.boardWallService.openCloseDoor(cellTarget);
            }

            if (cellTarget.region === CellRegion.CENTER) {
                this.boardLightService.attemptLightDialog(cellTarget.location);
            }
        }
    }

    private boardMap_clickResponse(): void {
    }

    @HostListener('document:keydown', ['$event'])
    public boardMap_handleKeyDownEvent(event: KeyboardEvent) {
        const key_code = event.code;
        switch (key_code) {
            case 'ShiftLeft' :
                this.boardStateService.shiftDown = true;
                this.boardStateService.board_controller_mode = BoardControllerMode.EPHEM_NOTATION;
                this.boardMap_refreshMouseLocation();
                break;
            case 'ShiftRight' :
                break;
            case 'Space' :
                this.boardStateService.spaceDown = true;
                break;
            case 'ControlLeft':
                this.boardStateService.ctrlDown = true;
                break;
        }
    }

    @HostListener('document:keyup', ['$event'])
    public boardMap_handleKeyUpEvent(event: KeyboardEvent) {
        const key_code = event.code;
        switch (key_code) {
            case 'ShiftLeft' :
                this.boardStateService.shiftDown = false;
                this.boardStateService.board_controller_mode = BoardControllerMode.DEFAULT;
                this.boardMap_refreshMouseLocation();
                break;
            case 'ShiftRight' :
                break;
            case 'Space' :
                this.boardStateService.spaceDown = false;
                break;
            case 'Escape':
                this.boardStateService.source_click_location = null;
                break;
            case 'ControlLeft':
                this.boardStateService.ctrlDown = false;
                break;
            case 'Minus':
                if (this.boardStateService.brush_size > 0) {
                    this.boardStateService.brush_size--;
                }
                break;
            case 'Equal':
                this.boardStateService.brush_size++;
                break;
        }
    }


    /****************************************************************************************************************
     * Mouse/Cursor Syncing Functions
     ****************************************************************************************************************/
    private boardMap_updateMouseLocation(location: XyPair): void {
        // UPDATE GLOBAL MOUSE LOCATIONS
        this.boardStateService.mouse_loc_screen = location;
        this.boardStateService.mouse_loc_canvas = this.boardTransformService.screen_to_canvas(this.boardStateService.mouse_loc_screen);
        this.boardStateService.mouse_loc_map = this.boardTransformService.screen_to_map(this.boardStateService.mouse_loc_screen);
        this.boardStateService.mouse_loc_cell = this.boardTransformService.screen_to_cell(this.boardStateService.mouse_loc_screen);
        this.boardStateService.mouse_loc_cell_pix = new XyPair(this.boardStateService.mouse_loc_map.x - (this.boardStateService.mouse_loc_cell.x * BoardStateService.cell_res), this.boardStateService.mouse_loc_map.y - (this.boardStateService.mouse_loc_cell.y * BoardStateService.cell_res));
        this.boardStateService.mouse_cell_target = this.boardTransformService.calculate_cell_target(this.boardStateService.mouse_loc_cell_pix);
        this.boardStateService.mouse_right_cell_target = this.boardTransformService.calculate_cell_target(this.boardStateService.mouse_loc_cell_pix, 0.2);
        this.boardStateService.mouseOnMap = this.boardStateService.coorInBounds(this.boardStateService.mouse_loc_cell.x, this.boardStateService.mouse_loc_cell.y);
    }

    private boardMap_refreshMouseLocation(): void {
        this.boardStateService.mouse_loc_canvas = this.boardTransformService.screen_to_canvas(this.boardStateService.mouse_loc_screen);
        this.boardStateService.mouse_loc_map = this.boardTransformService.screen_to_map(this.boardStateService.mouse_loc_screen);
        this.boardStateService.mouse_loc_cell = this.boardTransformService.screen_to_cell(this.boardStateService.mouse_loc_screen);
        this.boardStateService.mouse_loc_cell_pix = new XyPair(this.boardStateService.mouse_loc_map.x - (this.boardStateService.mouse_loc_cell.x * BoardStateService.cell_res), this.boardStateService.mouse_loc_map.y - (this.boardStateService.mouse_loc_cell.y * BoardStateService.cell_res));
        this.boardStateService.mouse_cell_target = this.boardTransformService.calculate_cell_target(this.boardStateService.mouse_loc_cell_pix);
        this.boardStateService.mouse_right_cell_target = this.boardTransformService.calculate_cell_target(this.boardStateService.mouse_loc_cell_pix, 0.2);
        this.boardStateService.mouseOnMap = this.boardStateService.coorInBounds(this.boardStateService.mouse_loc_cell.x, this.boardStateService.mouse_loc_cell.y);
    }

    private boardMap_clearMouseLocation(): void {
        this.boardStateService.mouse_loc_canvas = null;
        this.boardStateService.mouse_loc_map = null;
        this.boardStateService.mouse_loc_cell = null;
        this.boardStateService.mouse_loc_cell_pix = null;
        this.boardStateService.mouse_cell_target = null;
        this.boardStateService.mouse_right_cell_target = null;
        this.boardStateService.mouseOnMap = false;
    }


    /****************************************************************************************************************
     * View/Helper/Other Functions
     ****************************************************************************************************************/
    private getCursorClass(): string {
        if (this.boardStateService.spaceDown) {
            if (this.boardStateService.mouseLeftDown) {
                return 'cursorGrabbing'
            } else {
                return 'cursorGrab'
            }
        }

        if (this.boardStateService.mouseMiddleDown) {
            return 'cursorGrabbing'
        }
    }

    private syncMapContainerDims(): void {
        this.boardStateService.canvasElement_height = this.mapContainer.nativeElement.clientHeight;
        this.boardStateService.canvasElement_width = this.mapContainer.nativeElement.clientWidth;

        this.boardStateService.canvasElement_offsetTop = this.mapContainer.nativeElement.offsetTop;
        this.boardStateService.canvasElement_offsetLeft = this.mapContainer.nativeElement.offsetLeft;
    }

    private getSortedPlayers(): Array<Player> {
        return this.boardPlayerService.players.sort(this.playerCompare);
    }

    private playerCompare(player1: Player, player2: Player): number {
        let localPlayer1;
        if (isNullOrUndefined(player1.initiative)) {
            localPlayer1 = -10;
        } else {
            localPlayer1 = player1.initiative;
        }

        let localPlayer2;
        if (isNullOrUndefined(player2.initiative)) {
            localPlayer2 = -10;
        } else {
            localPlayer2 = player2.initiative;
        }


        if (localPlayer1 < localPlayer2) {
            return 1;
        }
        if (localPlayer1 > localPlayer2) {
            return -1;
        }
        return 0;
    }

    private checkForPlayerPops(loc_cell: XyPair, pop_origin: XyPair) {
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

}
