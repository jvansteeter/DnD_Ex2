import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {BoardVisibilityService} from "../../services/board-visibility.service";
import {XyPair} from "../../../../../../shared/types/encounter/board/xy-pair";
import {GeometryStatics} from "../../statics/geometry-statics";

@Component({
    selector: 'diagnostic-renderer',
    templateUrl: 'diagnostic-renderer.component.html'
})

export class DiagnosticRendererComponent implements OnInit, OnDestroy {
    @ViewChild('diagnosticRenderCanvas') diagnosticRenderCanvas: ElementRef;
    private ctx: CanvasRenderingContext2D;
    private frameId;

    constructor(
        private boardCanvasService: BoardCanvasService,
        private boardVisibilityService: BoardVisibilityService,
        private boardStateService: BoardStateService,
    ) {
    }

    ngOnInit(): void {
        this.ctx = this.diagnosticRenderCanvas.nativeElement.getContext('2d');
        this.render();
    }

    ngOnDestroy(): void {
    	cancelAnimationFrame(this.frameId);
    }

    render = () => {
        this.boardCanvasService.clear_canvas(this.ctx);
        this.boardCanvasService.updateTransform(this.ctx);

        if (this.boardStateService.diag_show_visibility_blocking_bitmap) {
            const localBitmap = this.boardVisibilityService.iKnowWhatImDoingGetTheBlockingBitMap();

            this.boardCanvasService.fill_canvas(this.ctx, 'rgba(0, 0, 0, ' + this.boardStateService.diag_layer_opacity / 100 + ')');

            for (let i = 0; i < localBitmap.numBits; i++) {
                // for each pixel, if the pixel is set [i.e. gets equal to 1]
                if (localBitmap.get(i)) {
                    this.boardCanvasService.draw_pixel(this.ctx, GeometryStatics.indexToXY(i, this.boardStateService.mapDimX * BoardStateService.cell_res), 'rgba(255, 255, 255, ' + this.boardStateService.diag_layer_opacity / 100 + ')');
                }
            }
        }

        this.frameId = requestAnimationFrame(this.render);
    }
}
