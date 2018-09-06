import {ViewMode} from '../../shared/enum/view-mode';
import {CellLightConfig} from '../../shared/cell-light-state';
import {LightValue} from '../../shared/enum/light-value';
import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BoardLightService} from '../../services/board-light.service';

@Component({
    selector: 'light-renderer',
    templateUrl: 'light-renderer.component.html'
})

export class LightRendererComponent implements OnInit {
    @ViewChild('lightRenderCanvasDark') lightRenderCanvasDark: ElementRef;
    @ViewChild('lightRenderCanvasDim') lightRenderCanvasDim: ElementRef;

    private ctx_dark: CanvasRenderingContext2D;
    private ctx_dim: CanvasRenderingContext2D;

    constructor(
        private boardStateService: BoardStateService,
        private boardCanvasService: BoardCanvasService,
        private boardLightService: BoardLightService
    ) {
    }

    ngOnInit() {
        this.ctx_dark = this.lightRenderCanvasDark.nativeElement.getContext('2d');
        this.ctx_dim = this.lightRenderCanvasDim.nativeElement.getContext('2d');
        this.render();
    }

    render = () => {
        this.boardCanvasService.clear_canvas(this.ctx_dark);
        this.boardCanvasService.clear_canvas(this.ctx_dim);

        this.boardCanvasService.updateTransform(this.ctx_dark);
        this.boardCanvasService.updateTransform(this.ctx_dim);

        // this.boardCanvasService.fill_canvas(this.ctx_dim, 'rgba(0, 0, 0, 0.5)');
        // this.boardCanvasService.fill_canvas(this.ctx_dark, 'rgba(0, 0, 0, 1.0');

        for (let poly of this.boardLightService.brightLightPolygons) {
            this.boardCanvasService.fill_point_array(this.ctx_dim, poly.border, 'rgba(0, 255, 0, 0.15)');
        }

        for (let poly of this.boardLightService.dimLightPolygons) {
            this.boardCanvasService.fill_point_array(this.ctx_dark, poly.border, 'rgba(0, 255, 0, 0.10');
        }

        requestAnimationFrame(this.render);
    };
}
