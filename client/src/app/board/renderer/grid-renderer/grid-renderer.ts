import {BoardService} from '../../services/board.service';
import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas-service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'grid-renderer',
  templateUrl: 'grid-renderer.component.html'
})

export class GridRendererComponent implements OnInit {
  @ViewChild('gridRenderCanvas') gridRenderCanvas: ElementRef;
  private ctx: CanvasRenderingContext2D;

  constructor(
    private bs: BoardService,
    private boardStateService: BoardStateService,
    private boardCanvasService: BoardCanvasService
  ) {}

  ngOnInit(): void {
    this.ctx = this.gridRenderCanvas.nativeElement.getContext('2d');
    this.render();
  }

  render = () => {
    this.boardCanvasService.clear_canvas(this.ctx);
    this.boardCanvasService.updateTransform(this.ctx);

    if (this.boardStateService.gridEnabled) {
      for (let x = 0; x < this.boardStateService.mapDimX; x += 1) {
        for (let y = 0; y < this.boardStateService.mapDimY; y += 1) {
          if (((x + y) % 2 === 0)) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.03';
            this.ctx.fillRect(x * this.boardStateService.cell_res, y * this.boardStateService.cell_res, this.boardStateService.cell_res, this.boardStateService.cell_res);
          } else {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.03';
            this.ctx.fillRect(x * this.boardStateService.cell_res, y * this.boardStateService.cell_res, this.boardStateService.cell_res, this.boardStateService.cell_res);
          }
        }
      }
    }

    requestAnimationFrame(this.render);
  }
}
