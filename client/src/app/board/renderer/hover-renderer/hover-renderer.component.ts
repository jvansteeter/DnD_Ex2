import {isNullOrUndefined} from 'util';
import {CellTarget} from '../../shared/cell-target';
import {CellRegion} from '../../shared/cell-region';
import {BoardMode} from '../../shared/board-mode';
import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'hover-renderer',
  templateUrl: 'hover-renderer.component.html'
})

export class HoverRendererComponent implements OnInit {
  @ViewChild('hoverRenderCanvas') hoverRenderCanvas: ElementRef;
  private ctx: CanvasRenderingContext2D;

  constructor(
    private boardStateService: BoardStateService,
    private boardCanvasService: BoardCanvasService
  ) {}

  ngOnInit() {
    this.ctx = this.hoverRenderCanvas.nativeElement.getContext('2d');
    this.render();
  }

  render = () => {
    this.boardCanvasService.clear_canvas(this.ctx);
    this.boardCanvasService.updateTransform(this.ctx);

    if (!isNullOrUndefined(this.boardStateService.mouse_cell_target) && this.boardStateService.mouseOnMap) {
      switch (this.boardStateService.board_edit_mode) {
        case BoardMode.WALLS:
          if (!isNullOrUndefined(this.boardStateService.source_click_location)) {
            // MOUSE ON MAP - WALL EDIT MODE - SOURCE IS DEFINED
            switch (this.boardStateService.mouse_cell_target.zone) {
              case CellRegion.CORNER:
                this.boardCanvasService.draw_corner(this.ctx, this.boardStateService.mouse_cell_target.coor, 'rgba(255, 0, 0, 0.2)', this.boardStateService.inputOffset);
                break;
            }
          } else {
            switch (this.boardStateService.mouse_cell_target.zone) {
              // MOUSE ON MAP - WALL EDIT MODE - SOURCE IS NOT DEFINED
              case CellRegion.LEFT_EDGE:
                this.boardCanvasService.draw_wall(this.ctx, this.boardStateService.mouse_cell_target, 8, 'rgba(0, 0, 255, 0.2');
                break;
              case CellRegion.TOP_EDGE:
                this.boardCanvasService.draw_wall(this.ctx, this.boardStateService.mouse_cell_target, 8, 'rgba(0, 0, 255, 0.2');
                break;
              case CellRegion.CORNER:
                this.boardCanvasService.draw_corner(this.ctx, this.boardStateService.mouse_cell_target.coor, 'rgba(255, 0, 0, 0.2)', this.boardStateService.inputOffset);
                break;
              case CellRegion.FWRD_EDGE:
                this.boardCanvasService.draw_wall(this.ctx, this.boardStateService.mouse_cell_target, 8, 'rgba(0, 0, 255, 0.2');
                break;
              case CellRegion.BKWD_EDGE:
                this.boardCanvasService.draw_wall(this.ctx, this.boardStateService.mouse_cell_target, 8, 'rgba(0, 0, 255, 0.2');
                break;
            }
          }
          break;
        case BoardMode.DOORS:
          switch (this.boardStateService.mouse_cell_target.zone) {
            case CellRegion.CENTER:
              break;
            case CellRegion.LEFT_EDGE:
              this.boardCanvasService.draw_wall(this.ctx, new CellTarget(this.boardStateService.mouse_cell_target.coor, CellRegion.LEFT_EDGE), 6, 'rgba(255, 0, 0, 0.2)');
              break;
            case CellRegion.TOP_EDGE:
              this.boardCanvasService.draw_wall(this.ctx, new CellTarget(this.boardStateService.mouse_cell_target.coor, CellRegion.TOP_EDGE), 6, 'rgba(255, 0, 0, 0.2)');
              break;
            case CellRegion.CORNER:
              break;
            case CellRegion.FWRD_EDGE:
              this.boardCanvasService.draw_wall(this.ctx, new CellTarget(this.boardStateService.mouse_cell_target.coor, CellRegion.FWRD_EDGE), 6, 'rgba(255, 0, 0, 0.2)');
              break;
            case CellRegion.BKWD_EDGE:
              this.boardCanvasService.draw_wall(this.ctx, new CellTarget(this.boardStateService.mouse_cell_target.coor, CellRegion.BKWD_EDGE), 6, 'rgba(255, 0, 0, 0.2)');
              break;
          }
          break;
        case BoardMode.LIGHTS:
          switch (this.boardStateService.mouse_cell_target.zone) {
            case CellRegion.CENTER:
              this.boardCanvasService.draw_center(this.ctx, this.boardStateService.mouse_cell_target.coor, 'rgba(255, 0, 0, 0.2)', this.boardStateService.inputOffset);
              break;
          }
          break;
        case BoardMode.TILES:
          break;
        case BoardMode.PLAYER:
          break;
      }
    }

    requestAnimationFrame(this.render);
  }
}
