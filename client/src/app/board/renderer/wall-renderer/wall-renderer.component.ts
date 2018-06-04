import {ViewMode} from '../../shared/view-mode';
import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas-service';
import {WallService} from '../../services/wall.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'wall-renderer',
  templateUrl: 'wall-renderer.component.html'
})

export class WallRendererComponent implements OnInit {
  @ViewChild('wallRenderCanvas') wallRenderCanvas: ElementRef;
  private ctx: CanvasRenderingContext2D;

  constructor(
    private wallService: WallService,
    private boardStateService: BoardStateService,
    private boardCanvasService: BoardCanvasService
  ) {}

  ngOnInit() {
    this.ctx = this.wallRenderCanvas.nativeElement.getContext('2d');
    this.render();
  }

  render = () => {
    this.boardCanvasService.clear_canvas(this.ctx);
    this.boardCanvasService.updateTransform(this.ctx);

    switch (this.boardStateService.board_view_mode) {
      case ViewMode.BOARD_MAKER:
        for (const wall of Array.from(this.wallService.wallData.values())) {
          this.boardCanvasService.draw_wall(this.ctx, wall.loc, 4, 'rgba(0, 255, 0, 0.75)');
        }
        break;
      case ViewMode.PLAYER:
        if (this.boardStateService.playerWallsEnabled) {
          for (const wall of Array.from(this.wallService.wallData.values())) {
            this.boardCanvasService.draw_wall(this.ctx, wall.loc, 8, 'rgba(0, 0, 0, 1)');
          }
        }
        break;
      case ViewMode.MASTER:
        for (const wall of Array.from(this.wallService.wallData.values())) {
          this.boardCanvasService.draw_wall(this.ctx, wall.loc, 4, 'rgba(0, 255, 0, 0.75)');
        }
        break;
    }

    requestAnimationFrame(this.render);
  }
}
