import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {XyPair} from '../../geometry/xy-pair';
import {BoardVisibilityService} from '../../services/board-visibility.service';
import {CellVisibilityState} from '../../shared/cell-visibility-state';
import {CellTarget} from '../../shared/cell-target';
import {CellPolygonGroup} from '../../shared/cell-polygon-group';
import {ViewMode} from '../../shared/enum/view-mode';
import {BoardPlayerService} from '../../services/board-player.service';

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

        switch (this.boardStateService.board_view_mode) {
            case ViewMode.BOARD_MAKER:
                this.boardPlayerService.player_visibility_map.forEach((value: CellPolygonGroup, key: string) => {
                    const fillCode = this.boardPlayerService.player_rgbaCode_map.get(key);
                    this.boardCanvasService.draw_fill_polygon(this.ctx, value.border, fillCode);
                });
                break;
            case ViewMode.MASTER:
                break;
            case ViewMode.PLAYER:
                this.ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
                const map_width = this.boardStateService.mapDimX * BoardStateService.cell_res;
                const map_height = this.boardStateService.mapDimY * BoardStateService.cell_res;
                this.ctx.fillRect(0, 0, map_width, map_height);
                // this.boardCanvasService.clear_polygon(this.ctx, this.testBorder);

                break;
        }



        requestAnimationFrame(this.render);
    }

}
