import {ViewMode} from '../../shared/enum/view-mode';
import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BoardWallService} from '../../services/board-wall.service';
import {BoardLightService} from '../../services/board-light.service';
import {EncounterService} from '../../../encounter/encounter.service';
import {IsReadyService} from '../../../utilities/services/isReady.service';
import {XyPair} from "../../../../../../shared/types/encounter/board/xy-pair";
import { RendererConsolidationService } from '../renderer-consolidation.service';
import { RendererComponent } from '../render-component.interface';

@Component({
    selector: 'map-renderer',
    templateUrl: 'map-renderer.component.html'
})
export class MapRendererComponent extends IsReadyService implements OnInit, OnDestroy, RendererComponent {
    // public static DEV_MAP_URL_STRING = 'resources/images/maps/shack.jpg';
	// TODO: this shouldn't be isReady

    @ViewChild('mapRenderCanvas', {static: false}) mapRenderCanvas: ElementRef;
    private ctx: CanvasRenderingContext2D;

    private bgImage = new Image();

    constructor(
        private boardStateService: BoardStateService,
        private boardCanvasService: BoardCanvasService,
        private boardWallService: BoardWallService,
        private boardLightService: BoardLightService,
        private encounterService: EncounterService,
        private renderConService: RendererConsolidationService,
    ) {
        super(encounterService);
        this.init();
    }

    init(): void {
        this.dependenciesSub = this.dependenciesReady().subscribe((isReady) => {
            if (isReady && !this.isReady()) {
                this.bgImage.src = this.encounterService.mapUrl;
                this.setReady(true);
            }
            else {
                this.setReady(false);
            }
        });
    }

    ngOnInit(): void {
        this.ctx = this.mapRenderCanvas.nativeElement.getContext('2d');
        this.renderConService.registerRenderer(this);
    }

    ngOnDestroy(): void {
        this.renderConService.deregisterRenderer(this);
    }

    render = () => {
        this.boardCanvasService.clear_canvas(this.ctx);
        this.boardCanvasService.updateTransform(this.ctx);

        if (this.encounterService.config.mapEnabled) {
            switch (this.boardStateService.board_view_mode) {
                case ViewMode.BOARD_MAKER:
                    this.boardCanvasService.draw_img(this.ctx, new XyPair(0, 0), this.bgImage, this.boardStateService.board_maker_map_opacity);
                    break;
                case ViewMode.MASTER:
                    this.boardCanvasService.draw_img(this.ctx, new XyPair(0, 0), this.bgImage, this.boardStateService.board_maker_map_opacity);
                    break;
                case ViewMode.PLAYER:
                    this.boardCanvasService.draw_img(this.ctx, new XyPair(0, 0), this.bgImage, this.boardStateService.board_maker_map_opacity);
                    break;
            }
        }
    }
}
