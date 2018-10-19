import {ViewMode} from '../../shared/enum/view-mode';
import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {BoardWallService} from '../../services/board-wall.service';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EncounterService } from '../../../encounter/encounter.service';

@Component({
    selector: 'wall-renderer',
    templateUrl: 'wall-renderer.component.html'
})
export class WallRendererComponent implements OnInit, OnDestroy {
    @ViewChild('wallRenderCanvas') wallRenderCanvas: ElementRef;
    private ctx: CanvasRenderingContext2D;
    private frameId;

    constructor(
        private wallService: BoardWallService,
        private boardStateService: BoardStateService,
        private boardCanvasService: BoardCanvasService,
        private encounterService: EncounterService,
    ) {
    }

    ngOnInit() {
        this.ctx = this.wallRenderCanvas.nativeElement.getContext('2d');
        this.render();
    }

    ngOnDestroy(): void {
    	cancelAnimationFrame(this.frameId);
    }

    render = () => {
        this.boardCanvasService.clear_canvas(this.ctx);
        this.boardCanvasService.updateTransform(this.ctx);

        switch (this.boardStateService.board_view_mode) {
            case ViewMode.BOARD_MAKER:
                for (const wall of Array.from(this.wallService.walls)) {
                    this.boardCanvasService.draw_wall(this.ctx, wall, 10, 'rgba(0, 180, 0, 0.75)');
                }

                for (const door of Array.from(this.wallService.doorData.values())) {
                    this.boardCanvasService.draw_door(this.ctx, door.target, door.isOpen);
                }

                break;
            case ViewMode.PLAYER:
                if (this.encounterService.config.playerWallsEnabled) {
                    for (const wall of Array.from(this.wallService.walls)) {
                        this.boardCanvasService.draw_wall(this.ctx, wall, 10, 'rgba(64, 80, 107, 1)');
                    }

                    for (const door of Array.from(this.wallService.doorData.values())) {
                        this.boardCanvasService.draw_door(this.ctx, door.target, door.isOpen);
                    }
                }
                break;
            case ViewMode.MASTER:
                for (const wall of Array.from(this.wallService.walls)) {
                    this.boardCanvasService.draw_wall(this.ctx, wall, 10, 'rgba(64, 80, 107, 1)');
                }

                for (const door of Array.from(this.wallService.doorData.values())) {
                    this.boardCanvasService.draw_door(this.ctx, door.target, door.isOpen);
                }
                break;
        }

        this.frameId = requestAnimationFrame(this.render);
    }
}
