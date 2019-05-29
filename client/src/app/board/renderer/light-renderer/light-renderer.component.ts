import {ViewMode} from '../../shared/enum/view-mode';
import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BoardLightService} from '../../services/board-light.service';
import {BoardPlayerService} from "../../services/board-player.service";
import {EncounterService} from '../../../encounter/encounter.service';
import { RendererConsolidationService } from '../renderer-consolidation.service';
import { RendererComponent } from '../render-component.interface';
import { RulesConfigService } from '../../../data-services/rules-config.service';
import { RuleModuleAspects } from '../../../../../../shared/predefined-aspects.enum';
import { BoardTeamsService } from '../../services/board-teams.service';
import { Player } from '../../../encounter/player';
import { RightsService } from "../../../data-services/rights.service";

@Component({
    selector: 'light-renderer',
    templateUrl: 'light-renderer.component.html'
})
export class LightRendererComponent implements OnInit, OnDestroy, RendererComponent {
    @ViewChild('lightRenderCanvasRoot', {static: false}) lightRenderCanvasRoot: ElementRef;
    private ctx_root: CanvasRenderingContext2D;

    constructor(
        private boardStateService: BoardStateService,
        private boardPlayerService: BoardPlayerService,
        private boardCanvasService: BoardCanvasService,
        private boardLightService: BoardLightService,
        private encounterService: EncounterService,
        private renderConService: RendererConsolidationService,
        private rulesConfigService: RulesConfigService,
        private teamsService: BoardTeamsService,
        private rightsService: RightsService,
    ) {
    }

    ngOnInit() {
        this.ctx_root = this.lightRenderCanvasRoot.nativeElement.getContext('2d');
        this.renderConService.registerRenderer(this);
    }

    ngOnDestroy(): void {
        this.renderConService.deregisterRenderer(this);
    }

    render = () => {
        this.boardCanvasService.clear_canvas(this.ctx_root);
        this.boardCanvasService.updateTransform(this.ctx_root);

        if (this.encounterService.isLightEnabled) {

            if (this.boardLightService.canvas_rebuild_lightSources) {
                this.boardCanvasService.fill_canvas(this.boardLightService.canvas_dim_context, 'rgba(0, 0, 0, 1)');
                this.boardCanvasService.fill_canvas(this.boardLightService.canvas_dark_context, 'rgba(0, 0, 0, 1)');

                for (let lightSource of this.boardLightService.lightSources) {
                    this.boardCanvasService.clear_xy_array(this.boardLightService.canvas_dark_context, lightSource.dim_polygon);
                    this.boardCanvasService.clear_xy_array(this.boardLightService.canvas_dim_context, lightSource.bright_polygon);
                }
                for (let player of this.boardPlayerService.players) {
									if (this.shouldRenderPlayerLightSource(player)) {
										const lightSource = this.boardPlayerService.getPlayerLightSource(player.id);
										this.boardCanvasService.clear_xy_array(this.boardLightService.canvas_dark_context, lightSource.dim_polygon);
										this.boardCanvasService.clear_xy_array(this.boardLightService.canvas_dim_context, lightSource.bright_polygon);
									}
                }
                this.boardLightService.canvas_rebuild_lightSources = false;
            }

            switch (this.boardStateService.board_view_mode) {
                case ViewMode.BOARD_MAKER:
                    this.ctx_root.globalAlpha = 0.45;
                    this.ctx_root.drawImage(this.boardLightService.canvas_dark, 0, 0);
                    this.ctx_root.globalAlpha = 0.25;
                    this.ctx_root.drawImage(this.boardLightService.canvas_dim, 0, 0);
                    this.ctx_root.globalAlpha = 1.0;
                    break;
                case ViewMode.MASTER:
                    this.ctx_root.globalAlpha = 0.45;
                    this.ctx_root.drawImage(this.boardLightService.canvas_dark, 0, 0);
                    this.ctx_root.globalAlpha = 0.25;
                    this.ctx_root.drawImage(this.boardLightService.canvas_dim, 0, 0);
                    this.ctx_root.globalAlpha = 1.0;
                    break;
                case ViewMode.PLAYER:
                    this.ctx_root.globalAlpha = 1.0;
                    this.ctx_root.drawImage(this.boardLightService.canvas_dark, 0, 0);
                    this.ctx_root.globalAlpha = 0.75;
                    this.ctx_root.drawImage(this.boardLightService.canvas_dim, 0, 0);
                    this.ctx_root.globalAlpha = 1.0;
                    break;
            }
        }
    };

    private shouldRenderPlayerLightSource(player: Player): boolean {
	    if (this.rulesConfigService.hasHiddenAndSneaking) {
		    const playerIsHidden = Boolean(player.characterData.values[RuleModuleAspects.HIDDEN]);
		    const playerOnUsersTeam = this.teamsService.userSharesTeamWithPlayer(player);
		    return (player.isVisible || this.rightsService.isMyPlayer(player)) && (!playerIsHidden || (playerIsHidden && playerOnUsersTeam));
	    }
	    return player.isVisible || this.rightsService.isMyPlayer(player);
    }
}
