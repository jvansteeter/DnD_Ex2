import {ViewMode} from '../../shared/enum/view-mode';
import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {BoardLightService} from '../../services/board-light.service';
import {BoardPlayerService} from "../../services/board-player.service";

@Component({
    selector: 'light-renderer',
    templateUrl: 'light-renderer.component.html'
})

export class LightRendererComponent implements OnInit, OnDestroy {
    @ViewChild('lightRenderCanvasDark') lightRenderCanvasDark: ElementRef;
    @ViewChild('lightRenderCanvasDim') lightRenderCanvasDim: ElementRef;

    private ctx_dark: CanvasRenderingContext2D;
    private ctx_dim: CanvasRenderingContext2D;
    private frameId;

    constructor(
        private boardStateService: BoardStateService,
        private boardPlayerService: BoardPlayerService,
        private boardCanvasService: BoardCanvasService,
        private boardLightService: BoardLightService
    ) {}

    ngOnInit() {
        this.ctx_dark = this.lightRenderCanvasDark.nativeElement.getContext('2d');
        this.ctx_dim = this.lightRenderCanvasDim.nativeElement.getContext('2d');
        this.render();
    }

    ngOnDestroy(): void {
    	cancelAnimationFrame(this.frameId);
    }

    render = () => {
        this.boardCanvasService.clear_canvas(this.ctx_dark);
        this.boardCanvasService.clear_canvas(this.ctx_dim);

        this.boardCanvasService.updateTransform(this.ctx_dark);
        this.boardCanvasService.updateTransform(this.ctx_dim);

        if (this.boardStateService.lightEnabled) {
            switch (this.boardStateService.board_view_mode) {
                case ViewMode.BOARD_MAKER:
                    this.boardCanvasService.fill_canvas(this.ctx_dim, 'rgba(0, 0, 0, 0.25)');
                    this.boardCanvasService.fill_canvas(this.ctx_dark, 'rgba(0, 0, 0, 0.45)');

                    for (let lightSource of [...this.boardLightService.lightSources, ...this.boardPlayerService.player_lightSource_map.values()]) {
                        this.boardCanvasService.clear_polygon(this.ctx_dark, lightSource.dim_polygon);
                        this.boardCanvasService.clear_polygon(this.ctx_dim, lightSource.bright_polygon);
                    }
                    break;
                // case ViewMode.PLAYER:
                //     this.boardCanvasService.fill_canvas(this.ctx_dim, 'rgba(0, 0, 0, 0.5)');
                //     for (let poly of this.boardLightService.brightLightPolygons) {
                //         this.boardCanvasService.clear_polygon(this.ctx_dim, poly);
                //     }
                //
                //     this.boardCanvasService.fill_canvas(this.ctx_dark, 'rgba(0, 0, 0, 1)');
                //     for (let poly of this.boardLightService.dimLightPolygons) {
                //         this.boardCanvasService.clear_polygon(this.ctx_dark, poly);
                //     }
                //     break;
                // case ViewMode.MASTER:
                //     this.boardCanvasService.fill_canvas(this.ctx_dim, 'rgba(0, 0, 0, 0.25)');
                //     for (let poly of this.boardLightService.brightLightPolygons) {
                //         this.boardCanvasService.clear_polygon(this.ctx_dim, poly);
                //     }
                //
                //     this.boardCanvasService.fill_canvas(this.ctx_dark, 'rgba(0, 0, 0, 0.45)');
                //     for (let poly of this.boardLightService.dimLightPolygons) {
                //         this.boardCanvasService.clear_polygon(this.ctx_dark, poly);
                //     }
                //     break;
            }
        }

        this.frameId = requestAnimationFrame(this.render);
    };
}
