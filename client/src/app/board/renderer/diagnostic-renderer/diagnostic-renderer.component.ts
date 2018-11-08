import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {BoardVisibilityService} from "../../services/board-visibility.service";
import {XyPair} from "../../../../../../shared/types/encounter/board/xy-pair";
import {GeometryStatics} from "../../statics/geometry-statics";
import {BoardTraverseService} from "../../services/board-traverse.service";
import {CellRegion} from "../../shared/enum/cell-region";
import {CellTarget} from "../../shared/cell-target";

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
        private boardTraverseService: BoardTraverseService,
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

        if (this.boardStateService.diag_show_traverse_markup) {
            for (let i = 0; i < this.boardTraverseService.numNodes; i++) {
                const xy_cell = GeometryStatics.indexToXY(i, this.boardStateService.mapDimX);

                let cell_target = new CellTarget(xy_cell, CellRegion.TOP_EDGE);
                if (this.boardTraverseService.targetIsBlocked(cell_target)) {
                    this.boardCanvasService.draw_wall(this.ctx, cell_target, 3, 'rgba(0, 255, 0, 0.8)');
                }

                cell_target = new CellTarget(xy_cell, CellRegion.LEFT_EDGE);
                if (this.boardTraverseService.targetIsBlocked(cell_target)) {
                    this.boardCanvasService.draw_wall(this.ctx, cell_target, 3, 'rgba(0, 255, 0, 0.8)');
                }

                cell_target = new CellTarget(xy_cell, CellRegion.FWRD_EDGE);
                if (this.boardTraverseService.targetIsBlocked(cell_target)) {
                    this.boardCanvasService.draw_wall(this.ctx, cell_target, 3, 'rgba(0, 255, 0, 0.8)');
                }

                cell_target = new CellTarget(xy_cell, CellRegion.BKWD_EDGE);
                if (this.boardTraverseService.targetIsBlocked(cell_target)) {
                    this.boardCanvasService.draw_wall(this.ctx, cell_target, 3, 'rgba(0, 255, 0, 0.8)');
                }

                if (this.boardTraverseService.traverseWeights[i][0] !== Infinity) {
                    this.boardCanvasService.draw_pointer_N(this.ctx, xy_cell, 'rgba(255,0,0,0.8)');
                }

                if (this.boardTraverseService.traverseWeights[i][1] !== Infinity) {
                    this.boardCanvasService.draw_pointer_E(this.ctx, xy_cell, 'rgba(255,0,0,0.8)');
                }

                if (this.boardTraverseService.traverseWeights[i][2] !== Infinity) {
                    this.boardCanvasService.draw_pointer_S(this.ctx, xy_cell, 'rgba(255,0,0,0.8)');
                }

                if (this.boardTraverseService.traverseWeights[i][3] !== Infinity) {
                    this.boardCanvasService.draw_pointer_W(this.ctx, xy_cell, 'rgba(255,0,0,0.8)');
                }

                if (this.boardTraverseService.traverseWeights[i][4] !== Infinity) {
                    this.boardCanvasService.draw_pointer_NW(this.ctx, xy_cell, 'rgba(255,0,0,0.8)');
                }

                if (this.boardTraverseService.traverseWeights[i][5] !== Infinity) {
                    this.boardCanvasService.draw_pointer_NE(this.ctx, xy_cell, 'rgba(255,0,0,0.8)');
                }

                if (this.boardTraverseService.traverseWeights[i][6] !== Infinity) {
                    this.boardCanvasService.draw_pointer_SE(this.ctx, xy_cell, 'rgba(255,0,0,0.8)');
                }

                if (this.boardTraverseService.traverseWeights[i][7] !== Infinity) {
                    this.boardCanvasService.draw_pointer_SW(this.ctx, xy_cell, 'rgba(255,0,0,0.8)');
                }
            }
        }

        this.frameId = requestAnimationFrame(this.render);
    }
}
