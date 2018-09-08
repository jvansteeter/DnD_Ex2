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

    public

    public lightSources: Array<LightSource>;

    public brightLightPolygons: Array<Polygon>;
    public dimLightPolygons: Array<Polygon>;

    constructor(private boardStateService: BoardStateService,
                private encounterService: EncounterService,
                private boardVisibilityService: BoardVisibilityService,) {
        super(boardStateService, encounterService);
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
        let brightLightPolygon;
        let dimLightPolygon;
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
        this.brightLightPolygons = [];
        this.dimLightPolygons = [];

        for (let lightSource of this.lightSources) {
            const polys = this.generateLightPolygons(lightSource);
            lightSource.dim_polygon = polys.dim_poly;
            lightSource.bright_polygon = polys.bright_poly;
            this.brightLightPolygons.push(polys.bright_poly);
            this.dimLightPolygons.push(polys.dim_poly);
        }

        const PLAYER_BRIGHT_RANGE = 2;
        const PLAYER_DIM_RANGE = 5;
        for (let player of this.encounterService.players) {
            const lightSourceResLocation = new XyPair(player.location.x * BoardStateService.cell_res + BoardStateService.cell_res/2, player.location.y * BoardStateService.cell_res + BoardStateService.cell_res/2);

            const bright_poly = this.raytracePolygon(lightSourceResLocation, PLAYER_BRIGHT_RANGE);
            const dim_poly = this.raytracePolygon(lightSourceResLocation, PLAYER_DIM_RANGE);
            this.dimLightPolygons.push(dim_poly);
            this.brightLightPolygons.push(bright_poly);
        }
    }
}