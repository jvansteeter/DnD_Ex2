import { ViewMode } from '../../shared/enum/view-mode';
import { BoardStateService } from '../../services/board-state.service';
import { BoardCanvasService } from '../../services/board-canvas.service';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BoardWallService } from '../../services/board-wall.service';
import { BoardLightService } from '../../services/board-light.service';
import { EncounterService } from '../../../encounter/encounter.service';
import { IsReadyService } from '../../../utilities/services/isReady.service';

@Component({
	selector: 'map-renderer',
	templateUrl: 'map-renderer.component.html'
})
export class MapRendererComponent extends IsReadyService implements OnInit, OnDestroy {
	// public static DEV_MAP_URL_STRING = 'resources/images/maps/shack.jpg';

	@ViewChild('mapRenderCanvas') mapRenderCanvas: ElementRef;
	private ctx: CanvasRenderingContext2D;
	private frameId;

	private bgImage = new Image();

	constructor(
			private boardStateService: BoardStateService,
			private boardCanvasService: BoardCanvasService,
			private boardWallService: BoardWallService,
			private boardLightService: BoardLightService,
			private encounterService: EncounterService,
	) {
		super(encounterService);
		this.init();
	}

	init(): void {
		this.dependenciesReady().subscribe((isReady) => {
			if (isReady) {
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
		this.render();
	}

	ngOnDestroy(): void {
		cancelAnimationFrame(this.frameId);
	}

	render = () => {
		this.boardCanvasService.clear_canvas(this.ctx);
		this.boardCanvasService.updateTransform(this.ctx);

		if (this.boardStateService.map_enabled) {
			switch (this.boardStateService.board_view_mode) {
				case ViewMode.BOARD_MAKER:
					this.ctx.globalAlpha = this.boardStateService.board_maker_map_opacity;
					this.ctx.drawImage(this.bgImage, 0, 0);
					this.ctx.globalAlpha = 1.0;
					break;
				case ViewMode.MASTER:
					this.ctx.drawImage(this.bgImage, 0, 0);
					break;
				case ViewMode.PLAYER:
					this.ctx.drawImage(this.bgImage, 0, 0);
					break;
			}
		}
		this.frameId = requestAnimationFrame(this.render);
	}
}
