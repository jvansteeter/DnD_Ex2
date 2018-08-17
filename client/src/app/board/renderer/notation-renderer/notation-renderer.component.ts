import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BoardNotationService} from '../../services/board-notation-service';
import {isUndefined} from "util";
import {ColorStatics} from "../../statics/color-statics";
import {XyPair} from "../../geometry/xy-pair";

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

            for (let text of notation.textElements) {
                this.boardCanvasService.draw_text(this.ctx, text.anchor, text.text, text.fontSize);
                if (notation === this.boardNotationService.getActiveNotation()) {
                    this.boardCanvasService.draw_img(this.ctx, new XyPair(text.anchor.x - 17, text.anchor.y - 17), this.boardNotationService.anchor_img);
                }
            }
        }

        requestAnimationFrame(this.render);
    }
}
