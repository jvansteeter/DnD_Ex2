import {ViewMode} from '../../shared/view-mode';
import {BoardConfigService} from '../../services/board-config.service';
import {BoardCanvasService} from '../../services/board-canvas-service';
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
    private bcs: BoardConfigService,
    private bctx: BoardCanvasService
  ) {
    this.bgImage.src = 'assets/tavern.jpg';
  }

  ngOnInit(): void {
    this.ctx = this.mapRenderCanvas.nativeElement.getContext('2d');
    this.render();
  }

  render = () => {
    this.bctx.clear_canvas(this.ctx);
    this.bctx.updateTransform(this.ctx);

    if (this.bcs.map_enabled) {
      switch (this.bcs.board_view_mode) {
        case ViewMode.BOARD_MAKER:
          this.ctx.globalAlpha = this.bcs.board_maker_map_opacity;
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
