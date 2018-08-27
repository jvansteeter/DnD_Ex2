import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {XyPair} from '../../geometry/xy-pair';
import { EncounterService } from '../../../encounter/encounter.service';
import {BoardPlayerService} from "../../services/board-player.service";
import {BoardTraverseService} from "../../services/board-traverse.service";
import {GeometryStatics} from "../../statics/geometry-statics";

@Component({
    selector: 'token-renderer',
    templateUrl: 'token-renderer.component.html'
})

export class TokenRendererComponent implements OnInit {
    @ViewChild('tokenRenderCanvas') tokenRenderCanvas: ElementRef;
    private ctx: CanvasRenderingContext2D;

    constructor(
        private boardStateService: BoardStateService,
        private boardCanvasService: BoardCanvasService,
        private encounterService: EncounterService,
        private boardPlayerService: BoardPlayerService,
        private boardTraverseService: BoardTraverseService
    ) {}

    ngOnInit(): void {
        this.ctx = this.tokenRenderCanvas.nativeElement.getContext('2d');
        this.boardTraverseService.isReady().subscribe((isReady: boolean) => {
            if (isReady) {
                this.render();
            }
        });
        // this.render();
    }

    render = () => {
        this.boardCanvasService.clear_canvas(this.ctx);
        this.boardCanvasService.updateTransform(this.ctx);

        for (const player of this.encounterService.players) {
            if (this.boardPlayerService.selectedPlayerIds.has(player._id)) {
                this.boardCanvasService.draw_fill_all(this.ctx, player.location, 'rgba(0, 0, 180, 0.2)');

                for (const cell of this.boardPlayerService.player_traverse_map_near.get(player._id)) {
                    if (this.boardStateService.coorInBounds(cell.x, cell.y)) {
                        this.boardCanvasService.draw_fill_all(this.ctx, cell, 'rgba(0, 0, 180, 0.1)');
                    }
                }

                for (const cell of this.boardPlayerService.player_traverse_map_far.get(player._id)) {
                    if (this.boardStateService.coorInBounds(cell.x, cell.y)) {
                        this.boardCanvasService.draw_fill_all(this.ctx, cell, 'rgba(0, 0, 180, 0.1)');
                    }
                }
            }

            this.boardCanvasService.draw_img(this.ctx, new XyPair(player.location.x * BoardStateService.cell_res, player.location.y * BoardStateService.cell_res), player.token_img);
            if (this.boardStateService.show_health) {
                this.boardCanvasService.draw_health_basic(this.ctx, player.location, player.hp/player.maxHp);
            }
        }

        // const dijkstra = this.boardTraverseService.dijkstraTraverse(new XyPair(25, 25), 15);
        // let index;
        // for (index = 0; index < dijkstra.length; index++) {
        //     const cell = GeometryStatics.indexToXY(index, this.boardStateService.mapDimX);
        //     this.boardCanvasService.draw_text(this.ctx, new XyPair((cell.x * BoardStateService.cell_res) + (BoardStateService.cell_res * 0.45), (cell.y * BoardStateService.cell_res) + (BoardStateService.cell_res * 0.45)), dijkstra[index].toString(), 15, 'rgba(255, 0, 0, 1)');
        // }

        requestAnimationFrame(this.render);
    }
}
