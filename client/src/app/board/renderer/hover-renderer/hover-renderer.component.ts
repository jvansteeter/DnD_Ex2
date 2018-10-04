import {isNullOrUndefined} from 'util';
import {CellTarget} from '../../shared/cell-target';
import {CellRegion} from '../../shared/enum/cell-region';
import {BoardMode} from '../../shared/enum/board-mode';
import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {BoardNotationService} from "../../services/board-notation-service";
import {NotationMode} from "../../shared/enum/notation-mode";
import {ColorStatics} from "../../statics/color-statics";
import {BoardVisibilityService} from "../../services/board-visibility.service";

@Component({
    selector: 'hover-renderer',
    templateUrl: 'hover-renderer.component.html'
})

export class HoverRendererComponent implements OnInit, OnDestroy {
    @ViewChild('hoverRenderCanvas') hoverRenderCanvas: ElementRef;
    private ctx: CanvasRenderingContext2D;
		private frameId;

    constructor(
        private boardStateService: BoardStateService,
        private boardCanvasService: BoardCanvasService,
        private boardNotationService: BoardNotationService,
        private boardVisibilityService: BoardVisibilityService
    ) {
    }

    ngOnInit() {
        this.ctx = this.hoverRenderCanvas.nativeElement.getContext('2d');
        this.render();
    }

    ngOnDestroy(): void {
    	cancelAnimationFrame(this.frameId);
    }

    render = () => {
        this.boardCanvasService.clear_canvas(this.ctx);
        this.boardCanvasService.updateTransform(this.ctx);

        if (!isNullOrUndefined(this.boardStateService.mouse_cell_target) && this.boardStateService.mouseOnMap) {

            if (this.boardStateService.isEditingNotation) {
                switch (this.boardNotationService.activeNotationMode) {
                    case NotationMode.POINT_TO_POINT:
                        break;
                    case NotationMode.FREEFORM:
                        break;
                    case NotationMode.CELL:
                        let cells;
                        if (this.boardStateService.do_visibility_brush) {
                            cells = this.boardVisibilityService.cellsVisibleFromCell(this.boardStateService.mouse_cell_target.location, this.boardStateService.brush_size);
                        } else {
                            cells = this.boardStateService.calcCellsWithinRangeOfCell(this.boardStateService.mouse_cell_target.location, this.boardStateService.brush_size);
                        }
                        for (let cell of cells) {
                            this.boardCanvasService.draw_center(this.ctx, cell, ColorStatics.resetRgbaStringAlpha(this.boardNotationService.getActiveNotation().getRgbaCode(), 0.25), 0);
                        }
                        break;
                }
            } else {
                switch (this.boardStateService.board_edit_mode) {
                    case BoardMode.WALLS:
                        if (!isNullOrUndefined(this.boardStateService.source_click_location)) {
                            // MOUSE ON MAP - WALL EDIT MODE - SOURCE IS DEFINED
                            switch (this.boardStateService.mouse_cell_target.region) {
                                case CellRegion.CORNER:
                                    this.boardCanvasService.draw_corner(this.ctx, this.boardStateService.mouse_cell_target.location, 'rgba(255, 0, 0, 0.2)', this.boardStateService.inputOffset);
                                    break;
                            }
                        } else {
                            switch (this.boardStateService.mouse_cell_target.region) {
                                // MOUSE ON MAP - WALL EDIT MODE - SOURCE IS NOT DEFINED
                                case CellRegion.LEFT_EDGE:
                                    this.boardCanvasService.draw_wall(this.ctx, this.boardStateService.mouse_cell_target, 8, 'rgba(0, 0, 255, 0.2');
                                    break;
                                case CellRegion.TOP_EDGE:
                                    this.boardCanvasService.draw_wall(this.ctx, this.boardStateService.mouse_cell_target, 8, 'rgba(0, 0, 255, 0.2');
                                    break;
                                case CellRegion.CORNER:
                                    this.boardCanvasService.draw_corner(this.ctx, this.boardStateService.mouse_cell_target.location, 'rgba(255, 0, 0, 0.2)', this.boardStateService.inputOffset);
                                    break;
                                case CellRegion.FWRD_EDGE:
                                    this.boardCanvasService.draw_wall(this.ctx, this.boardStateService.mouse_cell_target, 8, 'rgba(0, 0, 255, 0.2');
                                    break;
                                case CellRegion.BKWD_EDGE:
                                    this.boardCanvasService.draw_wall(this.ctx, this.boardStateService.mouse_cell_target, 8, 'rgba(0, 0, 255, 0.2');
                                    break;
                            }
                        }
                        break;
                    case BoardMode.DOORS:
                        switch (this.boardStateService.mouse_cell_target.region) {
                            case CellRegion.CENTER:
                                break;
                            case CellRegion.LEFT_EDGE:
                                this.boardCanvasService.draw_wall(this.ctx, new CellTarget(this.boardStateService.mouse_cell_target.location, CellRegion.LEFT_EDGE), 6, 'rgba(255, 0, 0, 0.2)');
                                break;
                            case CellRegion.TOP_EDGE:
                                this.boardCanvasService.draw_wall(this.ctx, new CellTarget(this.boardStateService.mouse_cell_target.location, CellRegion.TOP_EDGE), 6, 'rgba(255, 0, 0, 0.2)');
                                break;
                            case CellRegion.CORNER:
                                break;
                            case CellRegion.FWRD_EDGE:
                                this.boardCanvasService.draw_wall(this.ctx, new CellTarget(this.boardStateService.mouse_cell_target.location, CellRegion.FWRD_EDGE), 6, 'rgba(255, 0, 0, 0.2)');
                                break;
                            case CellRegion.BKWD_EDGE:
                                this.boardCanvasService.draw_wall(this.ctx, new CellTarget(this.boardStateService.mouse_cell_target.location, CellRegion.BKWD_EDGE), 6, 'rgba(255, 0, 0, 0.2)');
                                break;
                        }
                        break;
                    case BoardMode.LIGHTS:
                        switch (this.boardStateService.mouse_cell_target.region) {
                            case CellRegion.CENTER:
                                this.boardCanvasService.draw_center(this.ctx, this.boardStateService.mouse_cell_target.location, 'rgba(255, 0, 0, 0.2)', this.boardStateService.inputOffset);
                                break;
                        }
                        break;
                    case BoardMode.PLAYER:
                        break;
                }
            }
        }

        this.frameId = requestAnimationFrame(this.render);
    }
}
