import {ViewMode} from '../../shared/enum/view-mode';
import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {BoardWallService} from '../../services/board-wall.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'wall-renderer',
  templateUrl: 'wall-renderer.component.html'
})

export class WallRendererComponent implements OnInit {
  @ViewChild('wallRenderCanvas') wallRenderCanvas: ElementRef;
  private ctx: CanvasRenderingContext2D;

  constructor(
    private wallService: BoardWallService,
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
          this.boardCanvasService.draw_wall(this.ctx, wall.loc, 6, 'rgba(0, 255, 0, 0.75)');
        }
        break;
      case ViewMode.PLAYER:
        if (this.boardStateService.playerWallsEnabled) {
          for (const wall of Array.from(this.wallService.wallData.values())) {
            this.boardCanvasService.draw_wall(this.ctx, wall.loc, 10, 'rgba(25, 25, 25, 1)');
          }
        }
        break;
      case ViewMode.MASTER:
        for (const wall of Array.from(this.wallService.wallData.values())) {
          this.boardCanvasService.draw_wall(this.ctx, wall.loc, 6, 'rgba(0, 255, 0, 0.75)');
        }
        break;
    }

    requestAnimationFrame(this.render);
  }
}
