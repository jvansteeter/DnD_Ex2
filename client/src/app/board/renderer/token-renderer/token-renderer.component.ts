import {BoardService} from '../../services/board.service';
import {BoardConfigService} from '../../services/board-config.service';
import {BoardCanvasService} from '../../services/board-canvas-service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {XyPair} from '../../geometry/xy-pair';

@Component({
    selector: 'token-renderer',
    templateUrl: 'token-renderer.component.html'
})

export class TokenRendererComponent implements OnInit {
    @ViewChild('tokenRenderCanvas') tokenRenderCanvas: ElementRef;
    private ctx: CanvasRenderingContext2D;

    constructor(
        private bs: BoardService,
        private bcs: BoardConfigService,
        private bctx: BoardCanvasService
    ) {}

    ngOnInit(): void {
        this.ctx = this.tokenRenderCanvas.nativeElement.getContext('2d');
        this.render();
    }

    render = () => {
        this.bctx.clear_canvas(this.ctx);
        this.bctx.updateTransform(this.ctx);

        // do stuff here

        requestAnimationFrame(this.render);
    }
}
