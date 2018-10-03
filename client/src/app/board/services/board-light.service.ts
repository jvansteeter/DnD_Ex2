import {Injectable} from '@angular/core';
import {LightSource} from '../map-objects/light-source';
import {BoardStateService} from './board-state.service';
import {XyPair} from '../../../../../shared/types/encounter/board/xy-pair';
import {BoardVisibilityService} from './board-visibility.service';
import {IsReadyService} from "../../utilities/services/isReady.service";
import {Polygon} from "../../../../../shared/types/encounter/board/polygon";
import {EncounterService} from "../../encounter/encounter.service";
import { LightSourcesState } from '../map-objects/light-sources.state';
import { Observable } from 'rxjs';

@Injectable()
export class BoardLightService extends IsReadyService {
    private lightSourceState: LightSourcesState;

    constructor(private boardStateService: BoardStateService,
                private encounterService: EncounterService,
                private boardVisibilityService: BoardVisibilityService,) {
        super(boardStateService, encounterService);
        this.lightSourceState = new LightSourcesState();
        this.init();
    }

    public init(): void {
        this.dependenciesReady().subscribe((isReady: boolean) => {
            if (isReady) {
            	  this.lightSourceState.lightSources = this.encounterService.encounterState.lightSources;
            	  this.updateAllLightValues();
                this.setReady(true);
            }
        });
    }

    toggleLightSource(source: LightSource) {
        this.lightSourceState.toggle(source);
        this.updateLightValue(source);
    }

    updateLightValue(lightSource: LightSource): void {
	    const polys = this.generateLightPolygons(lightSource);
	    lightSource.dim_polygon = polys.dim_poly;
	    lightSource.bright_polygon = polys.bright_poly;
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
        for (let lightSource of this.lightSourceState.lightSources) {
            this.updateLightValue(lightSource as LightSource);
        }
    }

    public getSerializedState(): string {
    	return JSON.stringify(this.lightSourceState.lightSources);
    }

    get lightSources(): Array<LightSource> {
    	return this.lightSourceState.lightSources as LightSource[];
    }

    set lightSources(value: Array<LightSource>) {
    	this.lightSourceState.lightSources = value;
    	this.updateAllLightValues();
    }

    get lightSourcesChangeObservable(): Observable<void> {
    	return this.lightSourceState.changeObservable;
    }
}