import {BoardService} from '../../services/board.service';
import {ViewMode} from '../../shared/view-mode';
import {XyPair} from '../../geometry/xy-pair';
import {BoardConfigService} from '../../services/board-config.service';
import {BoardCanvasService} from '../../services/board-canvas-service';
import {TileService} from '../../services/tile.service';
import {BoardMode} from '../../shared/board-mode';
import {CellZone} from '../../shared/cell-zone';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'tile-renderer',
  templateUrl: 'tile-renderer.component.html'
})

export class TileRendererComponent implements OnInit {
  @ViewChild('tileRenderCanvas') tileRenderCanvas: ElementRef;
  private ctx: CanvasRenderingContext2D;

  constructor(
    private bs: BoardService,
    private bcs: BoardConfigService,
    private bctx: BoardCanvasService,
    private ts: TileService
  ) {}

  ngOnInit() {
    this.ctx = this.tileRenderCanvas.nativeElement.getContext('2d');
    this.render();
  }

  render = () => {
    this.bctx.clear_canvas(this.ctx);
    this.bctx.updateTransform(this.ctx);

    for (let x = 0; x < this.bcs.mapDimX; x++) {
      for (let y = 0; y < this.bcs.mapDimY; y++) {
        const tileState = this.ts.tileData[x][y];

        let handle_N = false;
        let handle_E = false;
        let handle_S = false;
        let handle_W = false;

        if (tileState.hasTop) {
          const tileImage = new Image();
          tileImage.src = tileState.topUrl;
          this.bctx.draw_fill_N(this.ctx, new XyPair(x, y), this.ctx.createPattern(tileImage, 'no-repeat'));
        }

        if (tileState.hasRight) {
          const tileImage = new Image();
          tileImage.src = tileState.rightUrl;
          this.bctx.draw_fill_E(this.ctx, new XyPair(x, y), this.ctx.createPattern(tileImage, 'no-repeat'));
        }

        if (tileState.hasBottom) {
          const tileImage = new Image();
          tileImage.src = tileState.bottomUrl;
          this.bctx.draw_fill_S(this.ctx, new XyPair(x, y), this.ctx.createPattern(tileImage, 'no-repeat'));
        }

        if (tileState.hasLeft) {
          const tileImage = new Image();
          tileImage.src = tileState.leftUrl;
          this.bctx.draw_fill_W(this.ctx, new XyPair(x, y), this.ctx.createPattern(tileImage, 'no-repeat'));
        }
      }
    }

    switch (this.bcs.board_view_mode) {
      case ViewMode.BOARD_MAKER:
        // render the hover cell
        if (this.bcs.board_edit_mode === BoardMode.TILES) {
          if (this.ts.activeTileUrl !== '') {
            const tileImage = new Image();
            tileImage.src = this.ts.activeTileUrl;
            const canvasPattern = this.ctx.createPattern(tileImage, 'no-repeat');

            if (this.bs.shiftDown) {
              switch (this.bs.mouse_cell_target.zone) {
                case CellZone.TOP:
                  this.bctx.draw_fill_N(this.ctx, this.bs.mouse_loc_cell, canvasPattern);
                  break;
                case CellZone.BOTTOM:
                  this.bctx.draw_fill_S(this.ctx, this.bs.mouse_loc_cell, canvasPattern);
                  break;
                case CellZone.LEFT:
                  this.bctx.draw_fill_W(this.ctx, this.bs.mouse_loc_cell, canvasPattern);
                  break;
                case CellZone.RIGHT:
                  this.bctx.draw_fill_E(this.ctx, this.bs.mouse_loc_cell, canvasPattern);
                  break;
              }
            } else {
              this.bctx.draw_fill_all(this.ctx, this.bs.mouse_loc_cell, canvasPattern);
            }
          }
        }
        break;
      case ViewMode.MASTER:
        break;
      case ViewMode.PLAYER:
        break;
    }

    requestAnimationFrame(this.render);
  }
}
