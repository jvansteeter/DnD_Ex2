import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BoardNotationService} from '../../services/board-notation-service';
import {isUndefined} from "util";
import {ColorStatics} from "../../statics/color-statics";

@Component({
    selector: 'notation-renderer',
    templateUrl: 'notation-renderer.component.html'
})

export class NotationRendererComponent implements OnInit {
    @ViewChild('notationRenderCanvas') gridRenderCanvas: ElementRef;
    private ctx: CanvasRenderingContext2D;

    constructor(
        private boardStateService: BoardStateService,
        private boardCanvasService: BoardCanvasService,
        private boardNotationService: BoardNotationService
    ) {
    }

    ngOnInit(): void {
        this.ctx = this.gridRenderCanvas.nativeElement.getContext('2d');
        this.render();
    }

    render = () => {
        this.boardCanvasService.clear_canvas(this.ctx);
        this.boardCanvasService.updateTransform(this.ctx);

        for (let notation of this.boardNotationService.notations) {
            for (let freeformPolyline of notation.freeformElements) {
                this.boardCanvasService.draw_polyline(this.ctx, freeformPolyline, notation.getRgbaCode(), 5);
            }

            for (let cell of notation.cellElements) {
                this.boardCanvasService.draw_center(this.ctx, cell, notation.getRgbaCode(), 0);
            }
        }

        requestAnimationFrame(this.render);
    }
}
