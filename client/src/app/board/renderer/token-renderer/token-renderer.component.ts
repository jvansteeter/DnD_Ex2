import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {XyPair} from '../../../../../../shared/types/encounter/board/xy-pair';
import {EncounterService} from '../../../encounter/encounter.service';
import {BoardPlayerService} from "../../services/board-player.service";
import {BoardTraverseService} from "../../services/board-traverse.service";
import {GeometryStatics} from "../../statics/geometry-statics";
import {RightsService} from '../../../data-services/rights.service';
import { RendererConsolidationService } from '../renderer-consolidation.service';
import { RendererComponent } from '../render-component.interface';
import { RulesConfigService } from '../../../data-services/rules-config.service';
import { BoardStealthService } from '../../services/board-stealth.service';

@Component({
    selector: 'token-renderer',
    templateUrl: 'token-renderer.component.html'
})

export class TokenRendererComponent implements OnInit, OnDestroy, RendererComponent {
    @ViewChild('tokenRenderCanvas') tokenRenderCanvas: ElementRef;
    private ctx: CanvasRenderingContext2D;

    constructor(
        private boardStateService: BoardStateService,
        private boardCanvasService: BoardCanvasService,
        private encounterService: EncounterService,
        private boardPlayerService: BoardPlayerService,
        private boardTraverseService: BoardTraverseService,
        private rightsService: RightsService,
        private renderConService: RendererConsolidationService,
        private rulesConfigService: RulesConfigService,
        private stealthService: BoardStealthService,
    ) {
    }

    ngOnInit(): void {
        this.ctx = this.tokenRenderCanvas.nativeElement.getContext('2d');
        this.boardTraverseService.isReadyObservable.subscribe((isReady: boolean) => {
            if (isReady) {
                this.renderConService.registerRenderer(this);
            }
        });
        // this.render();
    }

    ngOnDestroy(): void {
        this.renderConService.deregisterRenderer(this);
    }

    render = () => {
        this.boardCanvasService.clear_canvas(this.ctx);
        this.boardCanvasService.updateTransform(this.ctx);

        for (const player of this.encounterService.players) {

            if (this.boardPlayerService.hoveredPlayerId === player._id && (player.isVisible || this.rightsService.hasRightsToPlayer(player._id))) {
                this.boardCanvasService.draw_fill_all(this.ctx, player.location, 'rgba(0, 255, 0, 0.35)');
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

            if (player.isVisible) {
            	  let userCanSeePlayer = true;
		            if (this.rulesConfigService.hasHiddenAndSneaking && !this.rightsService.isEncounterGM() && !this.rightsService.isMyPlayer(player)) {
			              userCanSeePlayer = this.stealthService.userCanSeeHiddenPlayer(player);
		            }
		            if (userCanSeePlayer) {
				            this.boardCanvasService.draw_img(this.ctx, new XyPair(player.location.x * BoardStateService.cell_res, player.location.y * BoardStateService.cell_res), player.token_img, 1.0);
				            if (this.encounterService.config.showHealth) {
					              this.boardCanvasService.draw_health_basic(this.ctx, player.location, player.hp / player.maxHp);
				            }
		            }
            } else {
                if (this.rightsService.isEncounterGM() || this.rightsService.isMyPlayer(player)) {
                    this.boardCanvasService.draw_img(this.ctx, new XyPair(player.location.x * BoardStateService.cell_res, player.location.y * BoardStateService.cell_res), player.token_img, 0.35);
		                if (this.encounterService.config.showHealth) {
			                  this.boardCanvasService.draw_health_basic(this.ctx, player.location, player.hp / player.maxHp);
		                }
                }
            }
        }
    }
}
