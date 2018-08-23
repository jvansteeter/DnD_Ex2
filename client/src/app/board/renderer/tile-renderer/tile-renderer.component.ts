import {ViewMode} from '../../shared/enum/view-mode';
import {XyPair} from '../../geometry/xy-pair';
import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {BoardTileService} from '../../services/board-tile.service';
import {BoardMode} from '../../shared/enum/board-mode';
import {CellRegion} from '../../shared/enum/cell-region';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'tile-renderer',
  templateUrl: 'tile-renderer.component.html'
})

export class TileRendererComponent implements OnInit {
  @ViewChild('tileRenderCanvas') tileRenderCanvas: ElementRef;
  private ctx: CanvasRenderingContext2D;

  constructor(
    private boardStateService: BoardStateService,
    private boardCanvasService: BoardCanvasService,
    private ts: BoardTileService
  ) {}

  ngOnInit() {
    this.ctx = this.tileRenderCanvas.nativeElement.getContext('2d');
    this.render();
  }

  render = () => {
    this.boardCanvasService.clear_canvas(this.ctx);
    this.boardCanvasService.updateTransform(this.ctx);

    // for (let x = 0; x < this.boardStateService.mapDimX; x++) {
    //   for (let y = 0; y < this.boardStateService.mapDimY; y++) {
    //     const tileState = this.ts.tileData[x][y];
    //
    //     let handle_N = false;
    //     let handle_E = false;
    //     let handle_S = false;
    //     let handle_W = false;
    //
    //     if (tileState.hasTop) {
    //       const tileImage = new Image();
    //       tileImage.src = tileState.topUrl;
    //       this.boardCanvasService.draw_fill_N(this.ctx, new XyPair(x, y), this.ctx.createPattern(tileImage, 'no-repeat'));
    //     }
    //
    //     if (tileState.hasRight) {
    //       const tileImage = new Image();
    //       tileImage.src = tileState.rightUrl;
    //       this.boardCanvasService.draw_fill_E(this.ctx, new XyPair(x, y), this.ctx.createPattern(tileImage, 'no-repeat'));
    //     }
    //
    //     if (tileState.hasBottom) {
    //       const tileImage = new Image();
    //       tileImage.src = tileState.bottomUrl;
    //       this.boardCanvasService.draw_fill_S(this.ctx, new XyPair(x, y), this.ctx.createPattern(tileImage, 'no-repeat'));
    //     }
    //
    //     if (tileState.hasLeft) {
    //       const tileImage = new Image();
    //       tileImage.src = tileState.leftUrl;
    //       this.boardCanvasService.draw_fill_W(this.ctx, new XyPair(x, y), this.ctx.createPattern(tileImage, 'no-repeat'));
    //     }
    //   }
    // }
    //
    // switch (this.boardStateService.board_view_mode) {
    //   case ViewMode.BOARD_MAKER:
    //     // render the hover cell
    //     if (this.boardStateService.board_edit_mode === BoardMode.TILES) {
    //       if (this.ts.activeTileUrl !== '') {
    //         const tileImage = new Image();
    //         tileImage.src = this.ts.activeTileUrl;
    //         const canvasPattern = this.ctx.createPattern(tileImage, 'no-repeat');
    //
    //         if (this.boardStateService.shiftDown) {
    //           switch (this.boardStateService.mouse_cell_target.region) {
    //             case CellRegion.TOP_QUAD:
    //               this.boardCanvasService.draw_fill_N(this.ctx, this.boardStateService.mouse_loc_cell, canvasPattern);
    //               break;
    //             case CellRegion.BOTTOM_QUAD:
    //               this.boardCanvasService.draw_fill_S(this.ctx, this.boardStateService.mouse_loc_cell, canvasPattern);
    //               break;
    //             case CellRegion.LEFT_QUAD:
    //               this.boardCanvasService.draw_fill_W(this.ctx, this.boardStateService.mouse_loc_cell, canvasPattern);
    //               break;
    //             case CellRegion.RIGHT_QUAD:
    //               this.boardCanvasService.draw_fill_E(this.ctx, this.boardStateService.mouse_loc_cell, canvasPattern);
    //               break;
    //           }
    //         } else {
    //           this.boardCanvasService.draw_fill_all(this.ctx, this.boardStateService.mouse_loc_cell, canvasPattern);
    //         }
    //       }
    //     }
    //     break;
    //   case ViewMode.MASTER:
    //     break;
    //   case ViewMode.PLAYER:
    //     break;
    // }

    requestAnimationFrame(this.render);
  }
}
