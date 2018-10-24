import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {BoardVisibilityService} from '../../services/board-visibility.service';
import {ViewMode} from '../../shared/enum/view-mode';
import {BoardPlayerService} from '../../services/board-player.service';
import {PlayerVisibilityMode} from "../../../../../../shared/types/encounter/board/player-visibility-mode";
import {isDefined} from "@angular/compiler/src/util";
import { EncounterService } from '../../../encounter/encounter.service';

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
                switch (this.encounterService.config.playerVisibilityMode) {
                    case PlayerVisibilityMode.PLAYER:
                        break;
                    case PlayerVisibilityMode.TEAM:
                        break;
                    case PlayerVisibilityMode.GLOBAL:
                        break;
                }

                break;

            /***************************************************************************************************************************************************************************************
             * View mode - MASTER
             ***************************************************************************************************************************************************************************************/
            case ViewMode.MASTER:
                switch (this.encounterService.config.playerVisibilityMode) {
                    case PlayerVisibilityMode.PLAYER:
                        if (this.boardStateService.visibilityHighlightEnabled) {
                            const hoverPlayerId = this.boardPlayerService.hoveredPlayerId;
                            if (hoverPlayerId !== '') {
                                const fillCode = 'rgba(255,0,0,0.08)';
                                // this.boardCanvasService.draw_fill_polygon(this.ctx, this.boardPlayerService.player_visibility_map.get(hoverPlayerId).border, fillCode);
                                this.boardCanvasService.fill_point_array(this.ctx, this.boardPlayerService.player_visibility_map.get(hoverPlayerId).border, fillCode)
                            }
                        }
                        break;
                    case PlayerVisibilityMode.TEAM:
                        if (this.boardStateService.visibilityHighlightEnabled) {
                            for (let player of this.boardPlayerService.players) {
                                const visPoly = this.boardPlayerService.player_visibility_map.get(player._id);
                                if (isDefined(visPoly)) {
                                    this.boardCanvasService.fill_point_array(this.ctx, visPoly.border, 'rgba(255, 0, 0, 0.08)');
                                }
                            }
                        }
                        break;
                    case PlayerVisibilityMode.GLOBAL:
                        break;
                }
                break;

            /***************************************************************************************************************************************************************************************
             * View mode - PLAYER
             ***************************************************************************************************************************************************************************************/
            case ViewMode.PLAYER:
                switch (this.encounterService.config.playerVisibilityMode) {
                    case PlayerVisibilityMode.PLAYER:
                        break;
                    case PlayerVisibilityMode.TEAM:
                        this.boardCanvasService.fill_canvas(this.ctx, 'rgba(0, 0, 0, 1.0)');
                        for (let player of this.boardPlayerService.players) {
                            if (player.isVisible) {
                                const visPoly = this.boardPlayerService.player_visibility_map.get(player._id);
                                this.boardCanvasService.clear_polygon(this.ctx, visPoly);
                            }
                        }
                        break;
                    case PlayerVisibilityMode.GLOBAL:
                        break;
                }
                break;
        }

        this.frameId = requestAnimationFrame(this.render);
    }
}
