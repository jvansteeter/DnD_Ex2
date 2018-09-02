import {Injectable} from '@angular/core';
import {CellLightConfig} from '../shared/cell-light-state';
import {LightSource} from '../map-objects/light-source';
import {BoardStateService} from './board-state.service';
import {XyPair} from '../geometry/xy-pair';
import {BoardVisibilityService} from './board-visibility.service';
import {IsReadyService} from "../../utilities/services/isReady.service";
import {Polygon} from "../shared/polygon";

@Injectable()
export class BoardLightService extends IsReadyService {

    public lightSources: Array<LightSource>;
    public brightLightPolygons: Array<Polygon>;
    public dimLightPolygons: Array<Polygon>;

    constructor(
        private boardStateService: BoardStateService,
        private boardVisibilityService: BoardVisibilityService,
    ) {
        super(boardStateService);

        this.brightLightPolygons = new Array<Polygon>();
        this.dimLightPolygons = new Array<Polygon>();
        this.lightSources = new Array<LightSource>();

        this.init();
    }

    public init(): void {
        this.dependenciesReady().subscribe((isReady: boolean) => {
            if (isReady) {
                this.lightSources = new Array<LightSource>();
                this.setReady(true);
            }
        })
    }

    addLightSource(source: LightSource) {
        this.lightSources.push(source);
        this.updateLightValues();
    }

    toggleLightSource(location: XyPair, source = new LightSource(location, 5)) {
        this.addLightSource(source);
    }

    updateLightValues(): void {
        this.brightLightPolygons = [];
        this.dimLightPolygons = [];

        for (let lightSource of this.lightSources) {
            const lightSourceResLocation = new XyPair(lightSource.location.x * BoardStateService.cell_res, lightSource.location.y * BoardStateService.cell_res);

            let circlePoints = [];
            circlePoints = circlePoints.concat(BoardVisibilityService.BresenhamCircle(lightSourceResLocation.x, lightSourceResLocation.y, lightSource.bright_range * BoardStateService.cell_res));
            let addPoints = [];
            for (let point of circlePoints) {
                addPoints.push(new XyPair(point.x, point.y - 1));
            }

            circlePoints = circlePoints.concat(addPoints);

            this.brightLightPolygons.push(this.boardVisibilityService.raytraceVisibilityFromCell(lightSourceResLocation, 1000, ...circlePoints));
        }
    }
}