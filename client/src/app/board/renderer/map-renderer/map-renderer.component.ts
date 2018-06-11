import {ViewMode} from '../../shared/view-mode';
import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'map-renderer',
  templateUrl: 'map-renderer.component.html'
})

export class MapRendererComponent implements OnInit {
  @ViewChild('mapRenderCanvas') mapRenderCanvas: ElementRef;
  private ctx: CanvasRenderingContext2D;

  private bgImage = new Image();

  constructor(
    private boardStateService: BoardStateService,
    private boardCanvasService: BoardCanvasService
  ) {
    this.bgImage.src = 'resources/images/maps/tavern.jpg';
  }

  ngOnInit(): void {
    this.ctx = this.mapRenderCanvas.nativeElement.getContext('2d');
    this.render();
  }

  render = () => {
    this.boardCanvasService.clear_canvas(this.ctx);
    this.boardCanvasService.updateTransform(this.ctx);

    if (this.boardStateService.map_enabled) {
      switch (this.boardStateService.board_view_mode) {
        case ViewMode.BOARD_MAKER:
          this.ctx.globalAlpha = this.boardStateService.board_maker_map_opacity;
          this.ctx.drawImage(this.bgImage, 0, 0);
          this.ctx.globalAlpha = 1.0;
          break;
        case ViewMode.MASTER:
          this.ctx.drawImage(this.bgImage, 0, 0);
          break;
        case ViewMode.PLAYER:
          this.ctx.drawImage(this.bgImage, 0, 0);
          break;
      }
    }
    requestAnimationFrame(this.render);
  }
}
