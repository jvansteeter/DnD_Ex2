import {ViewMode} from '../../shared/view-mode';
import {BoardStateService} from '../../services/board-state.service';
import {BoardCanvasService} from '../../services/board-canvas.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BoardWallService} from '../../services/board-wall.service';
import {CellTarget} from '../../shared/cell-target';
import {XyPair} from '../../geometry/xy-pair';
import {CellZone} from '../../shared/cell-zone';
import {BoardLightService} from '../../services/board-light.service';
import {LightSource} from '../../map-objects/light-source';

@Component({
    selector: 'map-renderer',
    templateUrl: 'map-renderer.component.html'
})

export class MapRendererComponent implements OnInit {
    private DEV_MAP_URL_STRING = 'resources/images/maps/shack.jpg';


    @ViewChild('mapRenderCanvas') mapRenderCanvas: ElementRef;
    private ctx: CanvasRenderingContext2D;

    private bgImage = new Image();

    constructor(
        private boardStateService: BoardStateService,
        private boardCanvasService: BoardCanvasService,
        private boardWallService: BoardWallService,
        private boardLightService: BoardLightService
    ) {
        this.bgImage.src = this.DEV_MAP_URL_STRING;
    }

    ngOnInit(): void {
        this.ctx = this.mapRenderCanvas.nativeElement.getContext('2d');

        if (this.DEV_MAP_URL_STRING === 'resources/images/maps/shack.jpg') {
            // top wall
            this.boardWallService.addWall(new CellTarget(new XyPair(5, 2), CellZone.NORTH));
            this.boardWallService.addWall(new CellTarget(new XyPair(6, 2), CellZone.NORTH));
            this.boardWallService.addWall(new CellTarget(new XyPair(7, 2), CellZone.NORTH));

            // right wall
            this.boardWallService.addWall(new CellTarget(new XyPair(8, 2), CellZone.WEST));
            this.boardWallService.addWall(new CellTarget(new XyPair(8, 3), CellZone.WEST));
            this.boardWallService.addWall(new CellTarget(new XyPair(8, 4), CellZone.WEST));
            this.boardWallService.addWall(new CellTarget(new XyPair(8, 5), CellZone.WEST));

            // bottom wall
            this.boardWallService.addWall(new CellTarget(new XyPair(7, 6), CellZone.NORTH));
            this.boardWallService.addWall(new CellTarget(new XyPair(6, 6), CellZone.NORTH));
            this.boardWallService.addWall(new CellTarget(new XyPair(5, 6), CellZone.NORTH));

            // left wall
            this.boardWallService.addWall(new CellTarget(new XyPair(5, 5), CellZone.WEST));
            this.boardWallService.addWall(new CellTarget(new XyPair(5, 4), CellZone.WEST));
            // this.boardWallService.addWall(new CellTarget(new XyPair(5, 3), CellZone.WEST));              // DOOR
            this.boardWallService.addWall(new CellTarget(new XyPair(5, 2), CellZone.WEST));

            this.boardLightService.addLightSource(new LightSource(new XyPair(7, 3), 5));
        }

        this.render();
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
        requestAnimationFrame(this.render);
    }
}
