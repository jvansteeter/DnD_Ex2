import {Injectable} from '@angular/core';
import {LightSource} from '../map-objects/light-source';
import {BoardStateService} from './board-state.service';
import {XyPair} from '../../../../../shared/types/encounter/board/xy-pair';
import {BoardVisibilityService} from './board-visibility.service';
import {IsReadyService} from "../../utilities/services/isReady.service";
import {EncounterService} from "../../encounter/encounter.service";
import { LightSourcesState } from '../map-objects/light-sources.state';
import { Observable } from 'rxjs';
import {GeometryStatics} from "../statics/geometry-statics";

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
        let index = this.lightSourceState.getLightSourceIndex(source);
        if (index === -1) {
            this.updateLightValue(source);
            this.lightSourceState.add(source);
        } else {
            this.lightSourceState.remove(source);
        }
    }

    updateLightValue(lightSource: LightSource): void {
	    const polys = this.generateLightPolygons(lightSource);
	    lightSource.dim_polygon = polys.dim_poly;
	    lightSource.bright_polygon = polys.bright_poly;
    }

    generateLightPolygons(source: LightSource): {bright_poly: Array<XyPair>, dim_poly: Array<XyPair>} {
        console.log('generating light polygons');
        const lightSourcePixelLocation = new XyPair(source.location.x * BoardStateService.cell_res  + BoardStateService.cell_res/2, source.location.y * BoardStateService.cell_res  + BoardStateService.cell_res/2);

        const bright_pixel_range = source.bright_range * BoardStateService.cell_res + BoardStateService.cell_res / 2;
        const bright_range_circle = GeometryStatics.BresenhamCircle(lightSourcePixelLocation, bright_pixel_range);
        const bright_poly = this.boardVisibilityService.raytraceVisibilityFromCell(lightSourcePixelLocation, this.boardStateService.diag_visibility_ray_count, ...this.cropCircle(bright_range_circle));

        const dim_pixel_range = source.dim_range * BoardStateService.cell_res + BoardStateService.cell_res / 2;
        const dim_range_circle = GeometryStatics.BresenhamCircle(lightSourcePixelLocation, dim_pixel_range);
        const dim_poly = this.boardVisibilityService.raytraceVisibilityFromCell(lightSourcePixelLocation, this.boardStateService.diag_visibility_ray_count, ...this.cropCircle(dim_range_circle));

        return {bright_poly: bright_poly, dim_poly: dim_poly};
    }

    public cropCircle(circle_points: Array<XyPair>): Array<XyPair> {
        let cropped_points = new Array<XyPair>();
        for (let point of circle_points) {
            if (this.boardStateService.pixelPointInBounds(point)) {
                cropped_points.push(point);
                if (point.y >= this.boardStateService.mapDimY * BoardStateService.cell_res) {
                    cropped_points.push(new XyPair(point.x, point.y - 1));
                } else {
                    cropped_points.push(new XyPair(point.x, point.y + 1));
                }
            }
        }
        return cropped_points;
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
    }

    get lightSourcesChangeObservable(): Observable<void> {
    	return this.lightSourceState.changeObservable;
    }
}