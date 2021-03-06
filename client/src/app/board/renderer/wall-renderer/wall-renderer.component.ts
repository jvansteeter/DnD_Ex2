import {ViewMode} from '../../shared/enum/view-mode';
import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {BoardWallService} from '../../services/board-wall.service';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EncounterService } from '../../../encounter/encounter.service';
import { RendererConsolidationService } from '../renderer-consolidation.service';
import { RendererComponent } from '../render-component.interface';

@Component({
    selector: 'wall-renderer',
    templateUrl: 'wall-renderer.component.html'
})
export class WallRendererComponent implements OnInit, OnDestroy, RendererComponent {
    @ViewChild('wallRenderCanvas', {static: true}) wallRenderCanvas: ElementRef;
    private ctx: CanvasRenderingContext2D;

    constructor(
        private wallService: BoardWallService,
        private boardStateService: BoardStateService,
        private boardCanvasService: BoardCanvasService,
        private encounterService: EncounterService,
        private renderConService: RendererConsolidationService,
    ) {
    }

    ngOnInit() {
        this.ctx = this.wallRenderCanvas.nativeElement.getContext('2d');
				this.renderConService.registerRenderer(this);
    }

    ngOnDestroy(): void {
	      this.renderConService.deregisterRenderer(this);
    }

    render = () => {
        this.boardCanvasService.clear_canvas(this.ctx);
        this.boardCanvasService.updateTransform(this.ctx);

        switch (this.boardStateService.board_view_mode) {
            case ViewMode.BOARD_MAKER:
                for (const wall of this.wallService.walls) {
                    this.boardCanvasService.draw_wall(this.ctx, wall, 12, 'rgba(0, 180, 0, 0.75)');
                }

                for (const door of this.wallService.doors) {
                    this.boardCanvasService.draw_door(this.ctx, door.target, door.isOpen);
                }

                for (const window of this.wallService.windows) {
                    this.boardCanvasService.draw_wall(this.ctx, window.target, 12, 'rgba(0, 180, 0, 0.75)');
                    this.boardCanvasService.draw_window(this.ctx, window.target, window.isTransparent, window.isBlocking)
                }

                break;
            case ViewMode.PLAYER:
                if (this.encounterService.config.playerWallsEnabled) {
                    for (const wall of this.wallService.walls) {
                        this.boardCanvasService.draw_wall(this.ctx, wall, 12, 'rgba(64, 80, 107, 1)');
                    }

                    for (const door of this.wallService.doors) {
                        this.boardCanvasService.draw_door(this.ctx, door.target, door.isOpen);
                    }

                    for (const window of this.wallService.windows) {
                        this.boardCanvasService.draw_wall(this.ctx, window.target, 12, 'rgba(64, 80, 107, 1)');
                        this.boardCanvasService.draw_window(this.ctx, window.target, window.isTransparent, window.isBlocking)
                    }
                }
                break;
            case ViewMode.MASTER:
                for (const wall of this.wallService.walls) {
                    this.boardCanvasService.draw_wall(this.ctx, wall, 12, 'rgba(64, 80, 107, 1)');
                }

                for (const door of this.wallService.doors) {
                    this.boardCanvasService.draw_door(this.ctx, door.target, door.isOpen);
                }

                for (const window of this.wallService.windows) {
                    this.boardCanvasService.draw_wall(this.ctx, window.target, 12, 'rgba(64, 80, 107, 1)');
                    this.boardCanvasService.draw_window(this.ctx, window.target, window.isTransparent, window.isBlocking)
                }
                break;
        }
    }
}
