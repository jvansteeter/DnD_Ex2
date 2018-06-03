import {BoardService} from '../../services/board.service';
import {BoardConfigService} from '../../services/board-config.service';
import {BoardCanvasService} from '../../services/board-canvas-service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {XyPair} from '../../geometry/xy-pair';
import {EncounterDevService} from '../../../encounter/encounter-dev.service';

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
        private bctx: BoardCanvasService,
        private encounterService: EncounterDevService
    ) {}

    ngOnInit(): void {
        this.ctx = this.tokenRenderCanvas.nativeElement.getContext('2d');
        this.render();
    }

    render = () => {
        this.bctx.clear_canvas(this.ctx);
        this.bctx.updateTransform(this.ctx);

        // do stuff here
        for (const player of this.encounterService.players) {
            // this.bctx.draw_center(this.ctx, new XyPair(player.loc_x, player.loc_y), 'rgba(200, 120, 120, 0.8)', 0.8);
            if (player.isSelected) {
                this.bctx.draw_fill_all(this.ctx, player.loc, 'rgba(0, 0, 180, 0.2)');
            }
            this.bctx.draw_img(this.ctx, new XyPair(player.loc.x * this.bcs.cell_res, player.loc.y * this.bcs.cell_res), player.token_img)

        }

        requestAnimationFrame(this.render);
    }
}
