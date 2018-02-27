import {XyPair} from '../../geometry/xy-pair';
import {BoardService} from '../../services/board.service';
import {isNullOrUndefined} from 'util';
import {BoardConfigService} from '../../services/board-config.service';
import {BoardCanvasService} from '../../services/board-canvas-service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ViewMode} from '../../shared/view-mode';

@Component({
  selector: 'highlight-renderer',
  templateUrl: 'highlight-renderer.component.html'
})

export class HighlightRendererComponent implements OnInit {
  @ViewChild('highlightRenderCanvas') highlightRenderCanvas: ElementRef;
  private ctx: CanvasRenderingContext2D;

  constructor(
    private bs: BoardService,
    private bcs: BoardConfigService,
    private bctx: BoardCanvasService
  ) {}

  ngOnInit() {
    this.ctx = this.highlightRenderCanvas.nativeElement.getContext('2d');
    this.render();
  }

  render = () => {
    this.bctx.clear_canvas(this.ctx);
    this.bctx.updateTransform(this.ctx);

    switch (this.bcs.board_view_mode) {
      case ViewMode.BOARD_MAKER:
        // render the source boxes for the light sources
        for (const lightSource of Array.from(this.bs.lightSourceData.values())) {
          this.bctx.draw_center(this.ctx, lightSource.coor, 'rgba(255, 255, 0, 1)', 0.35);
          this.bctx.stroke_center(this.ctx, lightSource.coor, 'rgba(0, 0, 0, 1)', 0.35);
        }
        break;
      case ViewMode.MASTER:
        break;
      case ViewMode.PLAYER:
        break;
    }

    // render corner to corner grid
    if (!isNullOrUndefined(this.bs.source_click_location)) {
      const sc_loc = this.bs.source_click_location.coor;
      this.render_corner_to_corner(sc_loc);
    }

    requestAnimationFrame(this.render);
  }

  render_corner_to_corner(sc_loc: XyPair): void {
    this.bctx.draw_corner(this.ctx, sc_loc, 'rgba(0, 0, 220, 0.3)', this.bcs.inputOffset);

    let y = sc_loc.y;
    let x = sc_loc.x;
    while (this.bs.coorInBounds(x + 1, y)) {
      this.bctx.draw_corner(this.ctx, new XyPair(x + 1, y), 'rgba(0, 220, 0, 0.3)', this.bcs.inputOffset);
      x++;
    }

    y = sc_loc.y;
    x = sc_loc.x;
    while (this.bs.coorInBounds(x - 1, y)) {
      this.bctx.draw_corner(this.ctx, new XyPair(x - 1, y), 'rgba(0, 220, 0, 0.3)', this.bcs.inputOffset);
      x--;
    }

    y = sc_loc.y;
    x = sc_loc.x;
    while (this.bs.coorInBounds(x, y - 1)) {
      this.bctx.draw_corner(this.ctx, new XyPair(x, y - 1), 'rgba(0, 220, 0, 0.3)', this.bcs.inputOffset);
      y--;
    }

    y = sc_loc.y;
    x = sc_loc.x;
    while (this.bs.coorInBounds(x, y + 1)) {
      this.bctx.draw_corner(this.ctx, new XyPair(x, y + 1), 'rgba(0, 220, 0, 0.3)', this.bcs.inputOffset);
      y++;
    }

    y = sc_loc.y;
    x = sc_loc.x;
    while (this.bs.coorInBounds(x + 1, y + 1)) {
      this.bctx.draw_corner(this.ctx, new XyPair(x + 1, y + 1), 'rgba(0, 220, 0, 0.3)', this.bcs.inputOffset);
      y++;
      x++;
    }

    y = sc_loc.y;
    x = sc_loc.x;
    while (this.bs.coorInBounds(x - 1, y + 1)) {
      this.bctx.draw_corner(this.ctx, new XyPair(x - 1, y + 1), 'rgba(0, 220, 0, 0.3)', this.bcs.inputOffset);
      y++;
      x--;
    }

    y = sc_loc.y;
    x = sc_loc.x;
    while (this.bs.coorInBounds(x + 1, y - 1)) {
      this.bctx.draw_corner(this.ctx, new XyPair(x + 1, y - 1), 'rgba(0, 220, 0, 0.3)', this.bcs.inputOffset);
      y--;
      x++;
    }

    y = sc_loc.y;
    x = sc_loc.x;
    while (this.bs.coorInBounds(x - 1, y - 1)) {
      this.bctx.draw_corner(this.ctx, new XyPair(x - 1, y - 1), 'rgba(0, 220, 0, 0.3)', this.bcs.inputOffset);
      y--;
      x--;
    }
  }
}
