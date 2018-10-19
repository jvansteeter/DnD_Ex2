import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'grid-renderer',
  templateUrl: 'grid-renderer.component.html'
})

export class GridRendererComponent implements OnInit, OnDestroy {
  @ViewChild('gridRenderCanvas') gridRenderCanvas: ElementRef;
  private ctx: CanvasRenderingContext2D;
  private frameId;

  constructor(
    private boardStateService: BoardStateService,
    private boardCanvasService: BoardCanvasService
  ) {}

  ngOnInit(): void {
    this.ctx = this.gridRenderCanvas.nativeElement.getContext('2d');
    this.render();
  }

  ngOnDestroy(): void {
  	cancelAnimationFrame(this.frameId);
  }

  render = () => {
    this.boardCanvasService.clear_canvas(this.ctx);
    this.boardCanvasService.updateTransform(this.ctx);

    if (this.boardStateService.gridEnabled) {
        this.boardCanvasService.draw_grid(this.ctx);
    }

    this.frameId = requestAnimationFrame(this.render);
  }
}
