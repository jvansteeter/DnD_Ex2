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

    constructor(private boardStateService: BoardStateService,
                private boardVisibilityService: BoardVisibilityService,) {
        super(boardStateService);
        this.lightSources = new Array<LightSource>();
        this.brightLightPolygons = new Array<Polygon>();
        this.dimLightPolygons = new Array<Polygon>();

        this.init();
    }

    public init(): void {
        this.dependenciesReady().subscribe((isReady: boolean) => {
            if (isReady) {
                this.setReady(true);
            }
        })
    }

    addLightSource(source: LightSource) {
        this.lightSources.push(source);
        this.updateLightValues();
    }

    removeLightSource(source: LightSource) {
        let index = this.getLightSourceIndex(source);
        this.lightSources.splice(index, 1);
        this.updateLightValues();
    }

    toggleLightSource(source: LightSource) {
        let index = this.getLightSourceIndex(source);
        if (index === -1) {
            this.addLightSource(source);
        } else {
            this.removeLightSource(source);
        }
    }

    getLightSourceIndex(light: LightSource): number {
        let index = 0;
        for (let source of this.lightSources) {
            if (source.location.x == light.location.x && source.location.y == light.location.y) {
                return index;
            }
            index++;
        }
        return -1;
    }

    updateLightValues(): void {
        this.brightLightPolygons = [];
        this.dimLightPolygons = [];

        for (let lightSource of this.lightSources) {
            const lightSourceResLocation = new XyPair(lightSource.location.x * BoardStateService.cell_res, lightSource.location.y * BoardStateService.cell_res);

            let primaryCircle = BoardVisibilityService.BresenhamCircle(lightSourceResLocation.x + BoardStateService.cell_res/2, lightSourceResLocation.y + BoardStateService.cell_res/2, lightSource.bright_range * BoardStateService.cell_res);
            let croppedCircle = [];
            for (let point of primaryCircle) {
                if (this.boardStateService.pixelPointInBounds(point)) {
                    croppedCircle.push(point);
                    if (point.y >= this.boardStateService.mapDimY * BoardStateService.cell_res) {
                        croppedCircle.push(new XyPair(point.x, point.y - 1));
                    } else {
                        croppedCircle.push(new XyPair(point.x, point.y + 1));
                    }
                }
            }
            this.brightLightPolygons.push(this.boardVisibilityService.raytraceVisibilityFromCell(lightSourceResLocation, 1000, ...croppedCircle));

            primaryCircle = BoardVisibilityService.BresenhamCircle(lightSourceResLocation.x + BoardStateService.cell_res/2, lightSourceResLocation.y + BoardStateService.cell_res/2, lightSource.dim_range * BoardStateService.cell_res);
            croppedCircle = [];
            for (let point of primaryCircle) {
                if (this.boardStateService.pixelPointInBounds(point)) {
                    croppedCircle.push(point);
                    if (point.y >= this.boardStateService.mapDimY * BoardStateService.cell_res) {
                        croppedCircle.push(new XyPair(point.x, point.y - 1));
                    } else {
                        croppedCircle.push(new XyPair(point.x, point.y + 1));
                    }
                }
            }
            this.dimLightPolygons.push(this.boardVisibilityService.raytraceVisibilityFromCell(lightSourceResLocation, 1000, ...croppedCircle));



        }
    }
}