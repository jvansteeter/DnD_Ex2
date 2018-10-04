import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {XyPair} from '../../../../../../shared/types/encounter/board/xy-pair';
import { EncounterService } from '../../../encounter/encounter.service';
import {BoardPlayerService} from "../../services/board-player.service";
import {BoardTraverseService} from "../../services/board-traverse.service";
import {GeometryStatics} from "../../statics/geometry-statics";

@Component({
    selector: 'token-renderer',
    templateUrl: 'token-renderer.component.html'
})

export class TokenRendererComponent implements OnInit, OnDestroy {
    @ViewChild('tokenRenderCanvas') tokenRenderCanvas: ElementRef;
    private ctx: CanvasRenderingContext2D;
    private frameId;

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

    ngOnDestroy(): void {
    	cancelAnimationFrame(this.frameId);
    }

    render = () => {
        this.boardCanvasService.clear_canvas(this.ctx);
        this.boardCanvasService.updateTransform(this.ctx);

        for (const player of this.encounterService.players) {

            if (this.boardPlayerService.hoveredPlayerId === player._id) {
                this.boardCanvasService.draw_fill_all(this.ctx, player.location, 'rgba(255, 0, 0, 0.35)');
            }

            if (this.boardPlayerService.selectedPlayerId === player._id) {
                this.boardCanvasService.draw_fill_all(this.ctx, player.location, 'rgba(0, 0, 180, 0.2)');

                let cellIndex;
                const traverseMap = this.boardPlayerService.player_traverse_map.get(player._id);

                for (cellIndex = 0; cellIndex < traverseMap.length; cellIndex++) {
                    if (traverseMap[cellIndex] <= player.speed * 2) {
                        this.boardCanvasService.draw_fill_all(this.ctx, GeometryStatics.indexToXY(cellIndex, this.boardStateService.mapDimX), 'rgba(0, 0, 180, 0.1)');
                    }

                    if (traverseMap[cellIndex] <= player.speed) {
                        this.boardCanvasService.draw_fill_all(this.ctx, GeometryStatics.indexToXY(cellIndex, this.boardStateService.mapDimX), 'rgba(0, 0, 180, 0.1)');
                    }
                }
            }

            this.boardCanvasService.draw_img(this.ctx, new XyPair(player.location.x * BoardStateService.cell_res, player.location.y * BoardStateService.cell_res), player.token_img);
            if (this.boardStateService.show_health) {
                this.boardCanvasService.draw_health_basic(this.ctx, player.location, player.hp/player.maxHp);
            }
        }

        this.frameId = requestAnimationFrame(this.render);
    }
}
