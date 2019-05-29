import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { RendererConsolidationService } from '../renderer-consolidation.service';
import { RendererComponent } from '../render-component.interface';

@Component({
    selector: 'grid-renderer',
    templateUrl: 'grid-renderer.component.html'
})

export class GridRendererComponent implements OnInit, OnDestroy, RendererComponent {
    @ViewChild('gridRenderCanvas', {static: false}) gridRenderCanvas: ElementRef;
    private ctx_root: CanvasRenderingContext2D;

    constructor(
        private boardStateService: BoardStateService,
        private boardCanvasService: BoardCanvasService,
        private renderConService: RendererConsolidationService,
    ) {
    }

    ngOnInit(): void {
        this.ctx_root = this.gridRenderCanvas.nativeElement.getContext('2d');
        this.renderConService.registerRenderer(this);
    }

    ngOnDestroy(): void {
    	  this.renderConService.deregisterRenderer(this);
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
	          this.ctx_root.drawImage(this.boardCanvasService.grid_canvas, 0, 0);
        }
    }
}
