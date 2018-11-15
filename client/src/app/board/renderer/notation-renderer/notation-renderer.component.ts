import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {BoardNotationService} from '../../services/board-notation-service';
import {XyPair} from "../../../../../../shared/types/encounter/board/xy-pair";
import {GeometryStatics} from "../../statics/geometry-statics";
import {isNullOrUndefined} from "util";

@Component({
    selector: 'notation-renderer',
    templateUrl: 'notation-renderer.component.html'
})
export class NotationRendererComponent implements OnInit, OnDestroy {
    @ViewChild('notationRenderCanvas') gridRenderCanvas: ElementRef;
    private ctx: CanvasRenderingContext2D;
    private frameId;

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

    ngOnDestroy(): void {
    	cancelAnimationFrame(this.frameId);
    }

    render = () => {
        this.boardCanvasService.clear_canvas(this.ctx);
        this.boardCanvasService.updateTransform(this.ctx);

        if (!isNullOrUndefined(this.boardNotationService.lineNotationStartPoint)) {

            if (!isNullOrUndefined(this.boardStateService.mouse_loc_map)) {
                const end_point = this.boardStateService.mouse_loc_map;
                this.boardCanvasService.draw_line(this.ctx, this.boardNotationService.lineNotationStartPoint, this.boardStateService.mouse_loc_map, 1, this.boardNotationService.getActiveNotation().getRgbCode());
            }

            for (let cell of this.boardNotationService.lineNotationCells) {
                this.boardCanvasService.draw_fill_all(this.ctx, cell, this.boardNotationService.getActiveNotation().getRgbaCode());
            }
        }

        this.boardNotationService.purgeEphemNotations();
        for (let playerNotation of this.boardNotationService.ephemeralNotationMap.values()) {
	        for (let ephemFreeformPolyline of playerNotation) {
		        this.boardCanvasService.draw_polyline(this.ctx, ephemFreeformPolyline, 'rgba(0, 0, 255, 1.0)', 5);
	        }
        }

        for (let notation of this.boardNotationService.notations) {

            for (let freeformPolyline of notation.freeformElements) {
                this.boardCanvasService.draw_polyline(this.ctx, freeformPolyline, notation.getRgbaCode(), 5);
            }

            for (let cell of notation.cellElements) {
                this.boardCanvasService.draw_center(this.ctx, cell, notation.getRgbaCode(), 0);
            }

            for (let text of notation.textElements) {
                this.boardCanvasService.draw_text(this.ctx, text.anchor, text.text, text.fontSize, notation.getRgbaCode());
                if (notation === this.boardNotationService.getActiveNotation()) {
                    if (!!this.boardStateService.mouse_loc_map) {
                        if (GeometryStatics.distanceBetweenXyPairs(text.anchor, this.boardStateService.mouse_loc_map) < 18) {
                            this.boardCanvasService.draw_img(this.ctx, new XyPair(text.anchor.x - 17, text.anchor.y - 17), this.boardNotationService.anchor_active_image);
                        } else {
                            this.boardCanvasService.draw_img(this.ctx, new XyPair(text.anchor.x - 17, text.anchor.y - 17), this.boardNotationService.anchor_img);
                        }
                    } else {
                        this.boardCanvasService.draw_img(this.ctx, new XyPair(text.anchor.x - 17, text.anchor.y - 17), this.boardNotationService.anchor_img);
                    }
                }
            }
        }

        this.boardCanvasService.trim_canvas(this.ctx);

        this.frameId = requestAnimationFrame(this.render);
    }
}
