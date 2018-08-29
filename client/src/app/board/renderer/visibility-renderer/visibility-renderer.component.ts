import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BoardVisibilityService} from '../../services/board-visibility.service';
import {CellPolygonGroup} from '../../shared/cell-polygon-group';
import {ViewMode} from '../../shared/enum/view-mode';
import {BoardPlayerService} from '../../services/board-player.service';
import {PlayerVisibilityMode} from "../../shared/enum/player-visibility-mode";

@Component({
    selector: 'visibility-renderer',
    templateUrl: 'visibility-renderer.component.html'
})

export class VisibilityRendererComponent implements OnInit {
    @ViewChild('visibilityRenderCanvas') visibilityRenderCanvas: ElementRef;
    private ctx: CanvasRenderingContext2D;

    constructor(
        private boardStateService: BoardStateService,
        private boardCanvasService: BoardCanvasService,
        private boardVisibilityService: BoardVisibilityService,
        private boardPlayerService: BoardPlayerService
    ) {
    }

    ngOnInit(): void {
        this.ctx = this.visibilityRenderCanvas.nativeElement.getContext('2d');
        this.render();
    }

    render = () => {
        this.boardCanvasService.clear_canvas(this.ctx);
        this.boardCanvasService.updateTransform(this.ctx);

        this.boardCanvasService.stroke_point_array(this.ctx, this.boardVisibilityService.dummy_vis_array);

        switch (this.boardStateService.board_view_mode) {
            case ViewMode.BOARD_MAKER:
                switch (this.boardStateService.playerVisibilityMode) {
                    case PlayerVisibilityMode.PLAYER:
                        break;
                    case PlayerVisibilityMode.TEAM:
                        break;
                    case PlayerVisibilityMode.GLOBAL:
                        break;
                }

                break;
            case ViewMode.MASTER:
                switch (this.boardStateService.playerVisibilityMode) {
                    case PlayerVisibilityMode.PLAYER:
                        if (this.boardStateService.visibilityHighlightEnabled) {
                            const hoverPlayerId = this.boardPlayerService.hoveredPlayerId;
                            if (hoverPlayerId !== '') {
                                const fillCode = 'rgba(255,0,0,0.08)';
                                this.boardCanvasService.draw_fill_polygon(this.ctx, this.boardPlayerService.player_visibility_map.get(hoverPlayerId).border, fillCode);
                            }
                        }
                        break;
                    case PlayerVisibilityMode.TEAM:
                        if (this.boardStateService.visibilityHighlightEnabled) {
                            this.boardPlayerService.player_visibility_map.forEach((value: CellPolygonGroup) => {
                                const fillCode = 'rgba(255,0,0,0.08)';
                                this.boardCanvasService.draw_fill_polygon(this.ctx, value.border, fillCode);
                            });
                        }
                        break;
                    case PlayerVisibilityMode.GLOBAL:
                        break;
                }
                break;
            case ViewMode.PLAYER:
                switch (this.boardStateService.playerVisibilityMode) {
                    case PlayerVisibilityMode.PLAYER:
                        break;
                    case PlayerVisibilityMode.TEAM:
                        this.ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
                        const map_width = this.boardStateService.mapDimX * BoardStateService.cell_res;
                        const map_height = this.boardStateService.mapDimY * BoardStateService.cell_res;
                        this.ctx.fillRect(0, 0, map_width, map_height);

                        this.boardPlayerService.player_visibility_map.forEach((value: CellPolygonGroup) => {
                            this.boardCanvasService.clear_polygon(this.ctx, value.border);
                        });
                        break;
                    case PlayerVisibilityMode.GLOBAL:
                        break;
                }
                break;
        }


        requestAnimationFrame(this.render);
    }

}
