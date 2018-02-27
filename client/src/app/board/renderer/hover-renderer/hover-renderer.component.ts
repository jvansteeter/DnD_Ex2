import {BoardService} from '../../services/board.service';
import {isNull, isNullOrUndefined} from 'util';
import {CellTarget} from '../../shared/cell-target';
import {CellZone} from '../../shared/cell-zone';
import {BoardMode} from '../../shared/board-mode';
import {BoardConfigService} from '../../services/board-config.service';
import {BoardCanvasService} from '../../services/board-canvas-service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'hover-renderer',
  templateUrl: 'hover-renderer.component.html'
})

export class HoverRendererComponent implements OnInit {
  @ViewChild('hoverRenderCanvas') hoverRenderCanvas: ElementRef;
  private ctx: CanvasRenderingContext2D;

  constructor(
    private bs: BoardService,
    private bcs: BoardConfigService,
    private bctx: BoardCanvasService
  ) {}

  ngOnInit() {
    this.ctx = this.hoverRenderCanvas.nativeElement.getContext('2d');
    this.render();
  }

  render = () => {
    this.bctx.clear_canvas(this.ctx);
    this.bctx.updateTransform(this.ctx);

    if (!isNullOrUndefined(this.bs.mouse_cell_target) && this.bs.mouseOnMap) {
      switch (this.bcs.board_edit_mode) {
        case BoardMode.WALLS:
          if (!isNullOrUndefined(this.bs.source_click_location)) {
            // MOUSE ON MAP - WALL EDIT MODE - SOURCE IS DEFINED
            switch (this.bs.mouse_cell_target.zone) {
              case CellZone.CORNER:
                this.bctx.draw_corner(this.ctx, this.bs.mouse_cell_target.coor, 'rgba(255, 0, 0, 0.2)', this.bcs.inputOffset);
                break;
            }
          } else {
            switch (this.bs.mouse_cell_target.zone) {
              // MOUSE ON MAP - WALL EDIT MODE - SOURCE IS NOT DEFINED
              case CellZone.WEST:
                this.bctx.draw_wall(this.ctx, this.bs.mouse_cell_target, 8, 'rgba(0, 0, 255, 0.2');
                break;
              case CellZone.NORTH:
                this.bctx.draw_wall(this.ctx, this.bs.mouse_cell_target, 8, 'rgba(0, 0, 255, 0.2');
                break;
              case CellZone.CORNER:
                this.bctx.draw_corner(this.ctx, this.bs.mouse_cell_target.coor, 'rgba(255, 0, 0, 0.2)', this.bcs.inputOffset);
                break;
              case CellZone.FWR:
                this.bctx.draw_wall(this.ctx, this.bs.mouse_cell_target, 8, 'rgba(0, 0, 255, 0.2');
                break;
              case CellZone.BKW:
                this.bctx.draw_wall(this.ctx, this.bs.mouse_cell_target, 8, 'rgba(0, 0, 255, 0.2');
                break;
            }
          }
          break;
        case BoardMode.DOORS:
          switch (this.bs.mouse_cell_target.zone) {
            case CellZone.CENTER:
              break;
            case CellZone.WEST:
              this.bctx.draw_wall(this.ctx, new CellTarget(this.bs.mouse_cell_target.coor, CellZone.WEST), 6, 'rgba(255, 0, 0, 0.2)');
              break;
            case CellZone.NORTH:
              this.bctx.draw_wall(this.ctx, new CellTarget(this.bs.mouse_cell_target.coor, CellZone.NORTH), 6, 'rgba(255, 0, 0, 0.2)');
              break;
            case CellZone.CORNER:
              break;
            case CellZone.FWR:
              this.bctx.draw_wall(this.ctx, new CellTarget(this.bs.mouse_cell_target.coor, CellZone.FWR), 6, 'rgba(255, 0, 0, 0.2)');
              break;
            case CellZone.BKW:
              this.bctx.draw_wall(this.ctx, new CellTarget(this.bs.mouse_cell_target.coor, CellZone.BKW), 6, 'rgba(255, 0, 0, 0.2)');
              break;
          }
          break;
        case BoardMode.LIGHTS:
          switch (this.bs.mouse_cell_target.zone) {
            case CellZone.CENTER:
              this.bctx.draw_center(this.ctx, this.bs.mouse_cell_target.coor, 'rgba(255, 0, 0, 0.2)', this.bcs.inputOffset);
              break;
          }
          break;
        case BoardMode.TILES:
          break;
        case BoardMode.DEFAULT:
          break;
      }
    }

    requestAnimationFrame(this.render);
  }
}
