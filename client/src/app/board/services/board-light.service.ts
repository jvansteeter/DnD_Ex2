import {Injectable} from '@angular/core';
import {CellLightConfig} from '../shared/cell-light-state';
import {LightSource} from '../map-objects/light-source';
import {BoardStateService} from './board-state.service';
import {XyPair} from '../geometry/xy-pair';
import {BoardVisibilityService} from './board-visibility.service';
import {IsReadyService} from "../../utilities/services/isReady.service";
import {Polygon} from "../shared/polygon";
import {BoardPlayerService} from "./board-player.service";
import {EncounterService} from "../../encounter/encounter.service";

@Injectable()
export class BoardLightService extends IsReadyService {

    public lightSources: Array<LightSource>;

    constructor(private boardStateService: BoardStateService,
                private encounterService: EncounterService,
                private boardVisibilityService: BoardVisibilityService,) {
        super(boardStateService, encounterService);
        this.lightSources = new Array<LightSource>();
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
        this.updateAllLightValues();
    }

    removeLightSource(source: LightSource) {
        let index = this.getLightSourceIndex(source);
        this.lightSources.splice(index, 1);
        this.updateAllLightValues();
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

    updateLightValue(): void {
    }

    generateLightPolygons(source: LightSource): {bright_poly: Polygon, dim_poly: Polygon} {
        const lightSourceResLocation = new XyPair(source.location.x * BoardStateService.cell_res  + BoardStateService.cell_res/2, source.location.y * BoardStateService.cell_res  + BoardStateService.cell_res/2);
        const bright_poly = this.raytracePolygon(lightSourceResLocation, source.bright_range);
        const dim_poly = this.raytracePolygon(lightSourceResLocation, source.dim_range);
        return {bright_poly: bright_poly, dim_poly: dim_poly};
    }

    private raytracePolygon(pixelPoint: XyPair, cellRange: number, raytrace = 500): Polygon {
        let primaryCircle = BoardVisibilityService.BresenhamCircle(pixelPoint.x, pixelPoint.y, cellRange * BoardStateService.cell_res + BoardStateService.cell_res/2);
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
        return this.boardVisibilityService.raytraceVisibilityFromCell(pixelPoint, raytrace, ...croppedCircle);
    }

    updateAllLightValues(): void {
        for (let lightSource of this.lightSources) {
            const polys = this.generateLightPolygons(lightSource);
            lightSource.dim_polygon = polys.dim_poly;
            lightSource.bright_polygon = polys.bright_poly;
        }
    }
}