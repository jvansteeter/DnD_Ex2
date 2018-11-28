import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

@Component({
    selector: 'grid-renderer',
    templateUrl: 'grid-renderer.component.html'
})

export class GridRendererComponent implements OnInit, OnDestroy {
    @ViewChild('gridRenderCanvas') gridRenderCanvas: ElementRef;
    private ctx_root: CanvasRenderingContext2D;
    private frameId;

    constructor(
        private boardStateService: BoardStateService,
        private boardCanvasService: BoardCanvasService
    ) {
    }

    ngOnInit(): void {
        this.ctx_root = this.gridRenderCanvas.nativeElement.getContext('2d');
        this.render();
    }

    ngOnDestroy(): void {
        cancelAnimationFrame(this.frameId);
    }

    render = () => {
        this.boardCanvasService.clear_canvas(this.ctx_root);
        this.boardCanvasService.updateTransform(this.ctx_root);

        if (this.boardStateService.gridEnabled) {
            if (this.boardCanvasService.rebuild_grid_canvas) {
                this.boardCanvasService.clear_canvas(this.boardCanvasService.grid_canvas_ctx);
                this.boardCanvasService.draw_grid(this.boardCanvasService.grid_canvas_ctx);
                this.boardCanvasService.rebuild_grid_canvas = false;
            }
        }

        this.ctx_root.drawImage(this.boardCanvasService.grid_canvas, 0, 0);
        this.frameId = requestAnimationFrame(this.render);
    }
}
