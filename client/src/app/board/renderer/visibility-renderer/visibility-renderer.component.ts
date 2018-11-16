import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {BoardVisibilityService} from '../../services/board-visibility.service';
import {ViewMode} from '../../shared/enum/view-mode';
import {BoardPlayerService} from '../../services/board-player.service';
import {PlayerVisibilityMode} from "../../../../../../shared/types/encounter/board/player-visibility-mode";
import {isDefined} from "@angular/compiler/src/util";
import { EncounterService } from '../../../encounter/encounter.service';
import {UserProfileService} from "../../../data-services/userProfile.service";
import {BoardTeamsService} from "../../services/board-teams.service";

@Component({
    selector: 'visibility-renderer',
    templateUrl: 'visibility-renderer.component.html'
})

export class VisibilityRendererComponent implements OnInit, OnDestroy {
    @ViewChild('visibilityRenderCanvas') visibilityRenderCanvas: ElementRef;
    private ctx: CanvasRenderingContext2D;
    private frameId;

    constructor(
        private boardStateService: BoardStateService,
        private boardCanvasService: BoardCanvasService,
        private boardVisibilityService: BoardVisibilityService,
        private boardPlayerService: BoardPlayerService,
        private encounterService: EncounterService,
        private userProfileService: UserProfileService,
        private boardTeamsService: BoardTeamsService,
    ) {
    }

    ngOnInit(): void {
        this.ctx = this.visibilityRenderCanvas.nativeElement.getContext('2d');
        this.render();
    }

    ngOnDestroy(): void {
    	cancelAnimationFrame(this.frameId);
    }

    render = () => {
        this.boardCanvasService.clear_canvas(this.ctx);
        this.boardCanvasService.updateTransform(this.ctx);

        switch (this.boardStateService.board_view_mode) {
            /***************************************************************************************************************************************************************************************
             * View mode - BOARD_MAKER
             ***************************************************************************************************************************************************************************************/
            case ViewMode.BOARD_MAKER:
                if (this.boardStateService.visibilityHighlightEnabled) {
                    switch (this.encounterService.config.playerVisibilityMode) {
                        case PlayerVisibilityMode.PLAYER:
                            const hoverPlayerId = this.boardPlayerService.hoveredPlayerId;
                            if (hoverPlayerId !== '') {
                                this.boardCanvasService.fill_xy_array(this.ctx, this.boardPlayerService.player_visibility_map.get(hoverPlayerId), 'rgba(255,0,0,0.08)')
                            }
                            break;
                        case PlayerVisibilityMode.TEAM:
                            for (let player of this.boardPlayerService.players) {
                                const visPoly = this.boardPlayerService.player_visibility_map.get(player._id);
                                if (isDefined(visPoly)) {
                                    this.boardCanvasService.fill_xy_array(this.ctx, visPoly, 'rgba(255, 0, 0, 0.08)');
                                }
                            }
                            break;
                    }
                }
                break;

            /***************************************************************************************************************************************************************************************
             * View mode - MASTER
             ***************************************************************************************************************************************************************************************/
            case ViewMode.MASTER:
                if (this.boardStateService.visibilityHighlightEnabled) {
                    switch (this.encounterService.config.playerVisibilityMode) {
                        case PlayerVisibilityMode.PLAYER:
                            const hoverPlayerId = this.boardPlayerService.hoveredPlayerId;
                            if (hoverPlayerId !== '') {
                                this.boardCanvasService.fill_xy_array(this.ctx, this.boardPlayerService.player_visibility_map.get(hoverPlayerId), 'rgba(255,0,0,0.08)')
                            }
                            break;
                        case PlayerVisibilityMode.TEAM:
                            for (let player of this.boardPlayerService.players) {
                                const visPoly = this.boardPlayerService.player_visibility_map.get(player._id);
                                if (isDefined(visPoly)) {
                                    this.boardCanvasService.fill_xy_array(this.ctx, visPoly, 'rgba(255, 0, 0, 0.08)');
                                }
                            }
                            break;
                    }
                }
                break;

            /***************************************************************************************************************************************************************************************
             * View mode - PLAYER
             ***************************************************************************************************************************************************************************************/
            case ViewMode.PLAYER:
                this.boardCanvasService.fill_canvas(this.ctx, 'rgba(0, 0, 0, 1.0)');
                switch (this.encounterService.config.playerVisibilityMode) {
                    case PlayerVisibilityMode.PLAYER:
                        for (let player of this.boardPlayerService.players) {
                            if (player.userId === this.userProfileService.userId) {
                                const visPoly = this.boardPlayerService.player_visibility_map.get(player._id);
                                this.boardCanvasService.clear_xy_array(this.ctx, visPoly);
                            }
                        }
                        break;
                    case PlayerVisibilityMode.TEAM:
                        for (let player of this.boardPlayerService.players) {
                            if (player.isVisible && this.boardTeamsService.userSharesTeamWithPlayer(player)) {
                                const visPoly = this.boardPlayerService.player_visibility_map.get(player._id);
                                this.boardCanvasService.clear_xy_array(this.ctx, visPoly);
                            }
                        }
                        break;
                    case PlayerVisibilityMode.GLOBAL:
                        this.boardCanvasService.clear_canvas(this.ctx);
                        break;
                }
                break;
        }

        this.frameId = requestAnimationFrame(this.render);
    }
}
