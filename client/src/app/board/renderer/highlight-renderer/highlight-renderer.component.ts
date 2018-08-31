import {XyPair} from '../../geometry/xy-pair';
import {isNullOrUndefined} from 'util';
import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ViewMode} from '../../shared/enum/view-mode';
import {BoardLightService} from '../../services/board-light.service';

@Component({
    selector: 'highlight-renderer',
    templateUrl: 'highlight-renderer.component.html'
})

export class HighlightRendererComponent implements OnInit {
    @ViewChild('highlightRenderCanvas') highlightRenderCanvas: ElementRef;
    private ctx: CanvasRenderingContext2D;

    constructor(
        private boardStateService: BoardStateService,
        private boardCanvasService: BoardCanvasService,
        private boardLightService: BoardLightService
    ) {
    }

    ngOnInit() {
        this.ctx = this.highlightRenderCanvas.nativeElement.getContext('2d');
        this.render();
    }

    render = () => {
        this.boardCanvasService.clear_canvas(this.ctx);
        this.boardCanvasService.updateTransform(this.ctx);

        switch (this.boardStateService.board_view_mode) {
            case ViewMode.BOARD_MAKER:
                // render the source boxes for the light sources
                for (const lightSource of this.boardLightService.lightSources) {
                    this.boardCanvasService.draw_center(this.ctx, lightSource.location, 'rgba(255, 255, 0, 1)', 0.35);
                    this.boardCanvasService.stroke_center(this.ctx, lightSource.location, 'rgba(0, 0, 0, 1)', 0.35);
                }
                break;
            case ViewMode.MASTER:
                // render the source boxes for the light sources
                for (const lightSource of this.boardLightService.lightSources) {
                    this.boardCanvasService.draw_center(this.ctx, lightSource.location, 'rgba(255, 255, 0, .6)', 0.35);
                    this.boardCanvasService.stroke_center(this.ctx, lightSource.location, 'rgba(0, 0, 0, .3)', 0.33);
                }
                break;
            case ViewMode.PLAYER:
                break;
        }

        // render corner toUserId corner grid
        if (!isNullOrUndefined(this.boardStateService.source_click_location)) {
            const sc_loc = this.boardStateService.source_click_location.location;
            this.render_corner_to_corner(sc_loc);
        }

        requestAnimationFrame(this.render);
    }

    render_corner_to_corner(sc_loc: XyPair): void {
        this.boardCanvasService.draw_corner(this.ctx, sc_loc, 'rgba(0, 0, 220, 0.3)', this.boardStateService.inputOffset);

        let y = sc_loc.y;
        let x = sc_loc.x;
        while (this.boardStateService.coorInBounds(x + 1, y)) {
            this.boardCanvasService.draw_corner(this.ctx, new XyPair(x + 1, y), 'rgba(0, 220, 0, 0.3)', this.boardStateService.inputOffset);
            x++;
        }

        y = sc_loc.y;
        x = sc_loc.x;
        while (this.boardStateService.coorInBounds(x - 1, y)) {
            this.boardCanvasService.draw_corner(this.ctx, new XyPair(x - 1, y), 'rgba(0, 220, 0, 0.3)', this.boardStateService.inputOffset);
            x--;
        }

        y = sc_loc.y;
        x = sc_loc.x;
        while (this.boardStateService.coorInBounds(x, y - 1)) {
            this.boardCanvasService.draw_corner(this.ctx, new XyPair(x, y - 1), 'rgba(0, 220, 0, 0.3)', this.boardStateService.inputOffset);
            y--;
        }

        y = sc_loc.y;
        x = sc_loc.x;
        while (this.boardStateService.coorInBounds(x, y + 1)) {
            this.boardCanvasService.draw_corner(this.ctx, new XyPair(x, y + 1), 'rgba(0, 220, 0, 0.3)', this.boardStateService.inputOffset);
            y++;
        }

        y = sc_loc.y;
        x = sc_loc.x;
        while (this.boardStateService.coorInBounds(x + 1, y + 1)) {
            this.boardCanvasService.draw_corner(this.ctx, new XyPair(x + 1, y + 1), 'rgba(0, 220, 0, 0.3)', this.boardStateService.inputOffset);
            y++;
            x++;
        }

        y = sc_loc.y;
        x = sc_loc.x;
        while (this.boardStateService.coorInBounds(x - 1, y + 1)) {
            this.boardCanvasService.draw_corner(this.ctx, new XyPair(x - 1, y + 1), 'rgba(0, 220, 0, 0.3)', this.boardStateService.inputOffset);
            y++;
            x--;
        }

        y = sc_loc.y;
        x = sc_loc.x;
        while (this.boardStateService.coorInBounds(x + 1, y - 1)) {
            this.boardCanvasService.draw_corner(this.ctx, new XyPair(x + 1, y - 1), 'rgba(0, 220, 0, 0.3)', this.boardStateService.inputOffset);
            y--;
            x++;
        }

        y = sc_loc.y;
        x = sc_loc.x;
        while (this.boardStateService.coorInBounds(x - 1, y - 1)) {
            this.boardCanvasService.draw_corner(this.ctx, new XyPair(x - 1, y - 1), 'rgba(0, 220, 0, 0.3)', this.boardStateService.inputOffset);
            y--;
            x--;
        }
    }
}
