import {ViewMode} from '../../shared/enum/view-mode';
import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BoardLightService} from '../../services/board-light.service';
import {BoardPlayerService} from "../../services/board-player.service";
import {EncounterService} from '../../../encounter/encounter.service';

@Component({
    selector: 'light-renderer',
    templateUrl: 'light-renderer.component.html'
})
export class LightRendererComponent implements OnInit, OnDestroy {
    @ViewChild('lightRenderCanvasRoot') lightRenderCanvasRoot: ElementRef;
    private ctx_root: CanvasRenderingContext2D;

    private frameId;

    constructor(
        private boardStateService: BoardStateService,
        private boardPlayerService: BoardPlayerService,
        private boardCanvasService: BoardCanvasService,
        private boardLightService: BoardLightService,
        private encounterService: EncounterService,
    ) {
    }

    ngOnInit() {
        this.ctx_root = this.lightRenderCanvasRoot.nativeElement.getContext('2d');

        this.render();
    }

    ngOnDestroy(): void {
        cancelAnimationFrame(this.frameId);
    }

    render = () => {
        this.boardCanvasService.clear_canvas(this.ctx_root);
        this.boardCanvasService.updateTransform(this.ctx_root);

        if (this.encounterService.config.lightEnabled) {

            if (this.boardLightService.canvas_rebuild_lightSources) {
                this.boardCanvasService.fill_canvas(this.boardLightService.canvas_dim_context, 'rgba(0, 0, 0, 1)');
                this.boardCanvasService.fill_canvas(this.boardLightService.canvas_dark_context, 'rgba(0, 0, 0, 1)');

                for (let lightSource of [...this.boardLightService.lightSources, ...this.boardPlayerService.player_lightSource_map.values()]) {
                    this.boardCanvasService.clear_xy_array(this.boardLightService.canvas_dark_context, lightSource.dim_polygon);
                    this.boardCanvasService.clear_xy_array(this.boardLightService.canvas_dim_context, lightSource.bright_polygon);
                }
                this.boardLightService.canvas_rebuild_lightSources = false;
            }

            this.ctx_root.drawImage(this.boardLightService.canvas_dark, 0, 0);

            this.ctx_root.globalAlpha = 0.5;
            this.ctx_root.drawImage(this.boardLightService.canvas_dim, 0, 0);
            this.ctx_root.globalAlpha = 1.0;
        }

        this.frameId = requestAnimationFrame(this.render);
    };
}
