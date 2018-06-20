import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {XyPair} from '../../geometry/xy-pair';
import {BoardVisibilityService} from '../../services/board-visibility.service';
import {CellVisibilityState} from '../../shared/cell-visibility-state';
import {CellTarget} from '../../shared/cell-target';

@Component({
    selector: 'visibility-renderer',
    templateUrl: 'visibility-renderer.component.html'
})

export class VisibilityRendererComponent implements OnInit {
    @ViewChild('visibilityRenderCanvas') visibilityRenderCanvas: ElementRef;
    private ctx: CanvasRenderingContext2D;

    private cellsToShow: Array<CellTarget>;

    constructor(
        private boardStateService: BoardStateService,
        private boardCanvasService: BoardCanvasService,
        private boardVisibilityService: BoardVisibilityService
    ) {
    }

    ngOnInit(): void {
        this.ctx = this.visibilityRenderCanvas.nativeElement.getContext('2d');




        this.cellsToShow = this.boardVisibilityService.cellQuadsVisibleFromCell(new XyPair(6, 3));




        this.render();
    }

    render = () => {
        this.boardCanvasService.clear_canvas(this.ctx);
        this.boardCanvasService.updateTransform(this.ctx);

        this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        const map_width = this.boardStateService.mapDimX * this.boardStateService.cell_res;
        const map_height = this.boardStateService.mapDimY * this.boardStateService.cell_res;
        this.ctx.fillRect(0, 0, map_width, map_height);

        for (const cellQuad of this.cellsToShow) {
            this.boardCanvasService.clear_quad(this.ctx, cellQuad);
        }

        requestAnimationFrame(this.render);
    }

}
