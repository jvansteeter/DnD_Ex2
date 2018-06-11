import {BoardService} from '../../services/board.service';
import {ViewMode} from '../../shared/view-mode';
import {CellLightConfig} from '../../shared/cell-light-state';
import {LightValue} from '../../shared/light-value';
import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'light-renderer',
  templateUrl: 'light-renderer.component.html'
})

export class LightRendererComponent implements OnInit {
  @ViewChild('lightRenderCanvas') lightRenderCanvas: ElementRef;
  private ctx: CanvasRenderingContext2D;

  constructor(
    private boardService: BoardService,
    private boardStateService: BoardStateService,
    private boardCanvasService: BoardCanvasService
  ) {}

  ngOnInit() {
    this.ctx = this.lightRenderCanvas.nativeElement.getContext('2d');
    this.render();
  }

  render = () => {
    this.boardCanvasService.clear_canvas(this.ctx);
    this.boardCanvasService.updateTransform(this.ctx);

    switch (this.boardStateService.board_view_mode) {
      case ViewMode.BOARD_MAKER:
        // render the covers for the light values for each cell
        if (this.boardStateService.lightEnabled) {
          for (let x = 0; x < this.boardService.cellLightData.length; x++) {
            for (let y = 0; y < this.boardService.cellLightData[0].length; y++) {
              const cell = this.boardService.cellLightData[x][y];
              this.draw_cell_dim_light(cell, 'rgba(0, 0, 0, 0.3)');
              this.draw_cell_dark_light(cell, 'rgba(0, 0, 0, 0.5)');
            }
          }
        }
        break;
      case ViewMode.PLAYER:
        if (this.boardStateService.lightEnabled) {
          for (let x = 0; x < this.boardService.cellLightData.length; x++) {
            for (let y = 0; y < this.boardService.cellLightData[0].length; y++) {
              const cell = this.boardService.cellLightData[x][y];
              this.draw_cell_dim_light(cell, 'rgba(0, 0, 0, 0.5)');
              this.draw_cell_dark_light(cell, 'rgba(0, 0, 0, 1)');
            }
          }
        }
        break;
      case ViewMode.MASTER:
        // render the source boxes for the light sources
        for (const lightSource of Array.from(this.boardService.lightSourceData.values())) {
          this.boardCanvasService.draw_center(this.ctx, lightSource.coor, 'rgba(255, 255, 0, .6)', 0.35);
          this.boardCanvasService.stroke_center(this.ctx, lightSource.coor, 'rgba(0, 0, 0, .3)', 0.33);
        }

        // render the covers for the light values for each cell
        if (this.boardStateService.lightEnabled) {
          for (let x = 0; x < this.boardService.cellLightData.length; x++) {
            for (let y = 0; y < this.boardService.cellLightData[0].length; y++) {
              const cell = this.boardService.cellLightData[x][y];
              this.draw_cell_dim_light(cell, 'rgba(0, 0, 0, 0.3)');
              this.draw_cell_dark_light(cell, 'rgba(0, 0, 0, 0.5)');
            }
          }
        }
        break;
    }

    requestAnimationFrame(this.render);
  }

  draw_cell_dim_light(cell: CellLightConfig, rgba_code: string): void {
    const N_dim = cell.light_north === LightValue.DIM || cell.light_north === LightValue.DARK;
    const E_dim = cell.light_east === LightValue.DIM || cell.light_east === LightValue.DARK;
    const S_dim = cell.light_south === LightValue.DIM || cell.light_south === LightValue.DARK;
    const W_dim = cell.light_west === LightValue.DIM || cell.light_west === LightValue.DARK;

    if (N_dim && E_dim && S_dim && W_dim) {
      this.boardCanvasService.draw_fill_all(this.ctx, cell.coor, rgba_code);
    }
    if (!N_dim && E_dim && S_dim && W_dim) {
      this.boardCanvasService.draw_fill_ESW(this.ctx, cell.coor, rgba_code);
    }
    if (N_dim && !E_dim && S_dim && W_dim) {
      this.boardCanvasService.draw_fill_SWN(this.ctx, cell.coor, rgba_code);
    }
    if (N_dim && E_dim && !S_dim && W_dim) {
      this.boardCanvasService.draw_fill_WNE(this.ctx, cell.coor, rgba_code);
    }
    if (N_dim && E_dim && S_dim && !W_dim) {
      this.boardCanvasService.draw_fill_NES(this.ctx, cell.coor, rgba_code);
    }
    if (!N_dim && !E_dim && S_dim && W_dim) {
      this.boardCanvasService.draw_fill_SW(this.ctx, cell.coor, rgba_code);
    }
    if (N_dim && !E_dim && !S_dim && W_dim) {
      this.boardCanvasService.draw_fill_NW(this.ctx, cell.coor, rgba_code);
    }
    if (N_dim && E_dim && !S_dim && !W_dim) {
      this.boardCanvasService.draw_fill_NE(this.ctx, cell.coor, rgba_code);
    }
    if (!N_dim && E_dim && S_dim && !W_dim) {
      this.boardCanvasService.draw_fill_SE(this.ctx, cell.coor, rgba_code);
    }
    if (!N_dim && !E_dim && !S_dim && W_dim) {
      this.boardCanvasService.draw_fill_W(this.ctx, cell.coor, rgba_code);
    }
    if (N_dim && !E_dim && !S_dim && !W_dim) {
      this.boardCanvasService.draw_fill_N(this.ctx, cell.coor, rgba_code);
    }
    if (!N_dim && E_dim && !S_dim && !W_dim) {
      this.boardCanvasService.draw_fill_E(this.ctx, cell.coor, rgba_code);
    }
    if (!N_dim && !E_dim && S_dim && !W_dim) {
      this.boardCanvasService.draw_fill_S(this.ctx, cell.coor, rgba_code);
    }
    if (!N_dim && E_dim && !S_dim && W_dim) {
      this.boardCanvasService.draw_fill_E(this.ctx, cell.coor, rgba_code);
      this.boardCanvasService.draw_fill_W(this.ctx, cell.coor, rgba_code);
    }
    if (N_dim && !E_dim && S_dim && !W_dim) {
      this.boardCanvasService.draw_fill_S(this.ctx, cell.coor, rgba_code);
      this.boardCanvasService.draw_fill_N(this.ctx, cell.coor, rgba_code);
    }
  }

  draw_cell_dark_light(cell: CellLightConfig, rgba_code: string): void {
    const N_dark = cell.light_north === LightValue.DARK;
    const E_dark = cell.light_east === LightValue.DARK;
    const S_dark = cell.light_south === LightValue.DARK;
    const W_dark = cell.light_west === LightValue.DARK;

    if (N_dark && E_dark && S_dark && W_dark) {
      this.boardCanvasService.draw_fill_all(this.ctx, cell.coor, rgba_code);
    }
    if (!N_dark && E_dark && S_dark && W_dark) {
      this.boardCanvasService.draw_fill_ESW(this.ctx, cell.coor, rgba_code);
    }
    if (N_dark && !E_dark && S_dark && W_dark) {
      this.boardCanvasService.draw_fill_SWN(this.ctx, cell.coor, rgba_code);
    }
    if (N_dark && E_dark && !S_dark && W_dark) {
      this.boardCanvasService.draw_fill_WNE(this.ctx, cell.coor, rgba_code);
    }
    if (N_dark && E_dark && S_dark && !W_dark) {
      this.boardCanvasService.draw_fill_NES(this.ctx, cell.coor, rgba_code);
    }
    if (!N_dark && !E_dark && S_dark && W_dark) {
      this.boardCanvasService.draw_fill_SW(this.ctx, cell.coor, rgba_code);
    }
    if (N_dark && !E_dark && !S_dark && W_dark) {
      this.boardCanvasService.draw_fill_NW(this.ctx, cell.coor, rgba_code);
    }
    if (N_dark && E_dark && !S_dark && !W_dark) {
      this.boardCanvasService.draw_fill_NE(this.ctx, cell.coor, rgba_code);
    }
    if (!N_dark && E_dark && S_dark && !W_dark) {
      this.boardCanvasService.draw_fill_SE(this.ctx, cell.coor, rgba_code);
    }
    if (!N_dark && !E_dark && !S_dark && W_dark) {
      this.boardCanvasService.draw_fill_W(this.ctx, cell.coor, rgba_code);
    }
    if (N_dark && !E_dark && !S_dark && !W_dark) {
      this.boardCanvasService.draw_fill_N(this.ctx, cell.coor, rgba_code);
    }
    if (!N_dark && E_dark && !S_dark && !W_dark) {
      this.boardCanvasService.draw_fill_E(this.ctx, cell.coor, rgba_code);
    }
    if (!N_dark && !E_dark && S_dark && !W_dark) {
      this.boardCanvasService.draw_fill_S(this.ctx, cell.coor, rgba_code);
    }
    if (!N_dark && E_dark && !S_dark && W_dark) {
      this.boardCanvasService.draw_fill_E(this.ctx, cell.coor, rgba_code);
      this.boardCanvasService.draw_fill_W(this.ctx, cell.coor, rgba_code);
    }
    if (N_dark && !E_dark && S_dark && !W_dark) {
      this.boardCanvasService.draw_fill_S(this.ctx, cell.coor, rgba_code);
      this.boardCanvasService.draw_fill_N(this.ctx, cell.coor, rgba_code);
    }
  }
}
