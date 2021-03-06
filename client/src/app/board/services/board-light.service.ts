import {Injectable} from '@angular/core';
import {LightSource} from '../map-objects/light-source';
import {BoardStateService} from './board-state.service';
import {XyPair} from '../../../../../shared/types/encounter/board/xy-pair';
import {BoardVisibilityService} from './board-visibility.service';
import {IsReadyService} from "../../utilities/services/isReady.service";
import {EncounterService} from "../../encounter/encounter.service";
import {LightSourcesState} from '../map-objects/light-sources.state';
import {Observable} from 'rxjs';
import {GeometryStatics} from "../statics/geometry-statics";
import {MatDialog} from "@angular/material";
import {LightEditDialogComponent} from "../dialogs/light-edit-dialog/light-edit-dialog.component";
import {isNullOrUndefined} from "util";
import {BoardCanvasService} from "./board-canvas.service";
import { PlayerVisibilityMode } from "../../../../../shared/types/encounter/board/player-visibility-mode";

@Injectable()
export class BoardLightService extends IsReadyService {
    private lightSourceState: LightSourcesState;

    public canvas_rebuild_lightSources: boolean = true;
    public canvas_dark: HTMLCanvasElement;
    public canvas_dark_context: CanvasRenderingContext2D;
    public canvas_dim: HTMLCanvasElement;
    public canvas_dim_context: CanvasRenderingContext2D;


    constructor(private boardStateService: BoardStateService,
                private encounterService: EncounterService,
                private boardCanvasService: BoardCanvasService,
                private dialog: MatDialog,
                private boardVisibilityService: BoardVisibilityService,) {
        super(boardStateService, encounterService, boardVisibilityService, boardCanvasService);
        this.init();
    }

    public init(): void {
        this.lightSourceState = new LightSourcesState();
        this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
            if (isReady && !this.isReady()) {
                console.log('boardLightService.init() -> isReady');
                this.lightSourceState.lightSources = this.encounterService.lightSources;

                this.canvas_rebuild_lightSources = true;
                this.canvas_dark = document.createElement('canvas');
                this.canvas_dark.height = BoardStateService.map_res_y;
                this.canvas_dark.width = BoardStateService.map_res_x;
                this.canvas_dark_context = this.canvas_dark.getContext('2d');

                this.canvas_dim = document.createElement('canvas');
                this.canvas_dim.height = BoardStateService.map_res_y;
                this.canvas_dim.width = BoardStateService.map_res_x;
                this.canvas_dim_context = this.canvas_dim.getContext('2d');

                this.updateAllLightValues();
                this.setReady(true);
            }
        });
    }

    public unInit(): void {
        console.log('boardLightService.unInit()');
        delete this.lightSourceState;
        delete this.canvas_dim;
        delete this.canvas_dim_context;
        delete this.canvas_dark;
        delete this.canvas_dark_context;

        super.unInit();
    }

    public toggleLightSource(source: LightSource) {
        let index = this.lightSourceState.getLightSourceIndex(source);
        if (index === -1) {
            this.updateLightValue(source);
            this.lightSourceState.add(source);
        } else {
            this.lightSourceState.remove(source);
        }
        this.canvas_rebuild_lightSources = true;
    }

    public updateLightValue(lightSource: LightSource): void {
        const polys = this.generateLightPolygons(lightSource);
        lightSource.dim_polygon = polys.dim_poly;
        lightSource.bright_polygon = polys.bright_poly;
    }

    public attemptLightDialog(cell: XyPair): void {
        const lightSource = this.lightSourceState.getLightSourceData_byCell(cell) as LightSource;
        if (!isNullOrUndefined(lightSource)) {
            this.dialog.open(LightEditDialogComponent, {data: {lightSource: lightSource}}).afterClosed().subscribe((lightRanges: { bright_range: number, dim_range: number }) => {
                if (!isNullOrUndefined(lightRanges)) {
                    this.lightSourceState.updateLightSourceBrightRange_byCell(cell, lightRanges.bright_range);
                    this.lightSourceState.updateLightSourceDimRange_byCell(cell, lightRanges.dim_range);
                    this.updateLightValue(this.lightSourceState.getLightSourceData_byCell(cell) as LightSource);
                    this.lightSourceState.manualEmitChange();
                }
            });
        }
    }

    public generateLightPolygons(source: LightSource): { bright_poly: Array<XyPair>, dim_poly: Array<XyPair> } {
        const lightSourcePixelLocation = new XyPair(source.location.x * BoardStateService.cell_res + BoardStateService.cell_res / 2, source.location.y * BoardStateService.cell_res + BoardStateService.cell_res / 2);

        const bright_pixel_range = source.bright_range * BoardStateService.cell_res + BoardStateService.cell_res / 2;
        const bright_range_circle = GeometryStatics.BresenhamCircle(lightSourcePixelLocation, bright_pixel_range);
        const bright_poly = this.boardVisibilityService.raytraceVisibilityFromCell(lightSourcePixelLocation, this.boardStateService.diag_visibility_ray_count, ...this.cropCircle(bright_range_circle));

        const dim_pixel_range = source.dim_range * BoardStateService.cell_res + BoardStateService.cell_res / 2;
        const dim_range_circle = GeometryStatics.BresenhamCircle(lightSourcePixelLocation, dim_pixel_range);
        const dim_poly = this.boardVisibilityService.raytraceVisibilityFromCell(lightSourcePixelLocation, this.boardStateService.diag_visibility_ray_count, ...this.cropCircle(dim_range_circle));

        this.canvas_rebuild_lightSources = true;
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
        this.canvas_rebuild_lightSources = true;
        this.updateAllLightValues();
    }

    get lightSourcesChangeObservable(): Observable<void> {
        return this.lightSourceState.changeObservable;
    }

    public getLightSourceAtCell(cell: XyPair): LightSource {
        return this.lightSourceState.getLightSourceData_byCell(cell) as LightSource;
    }

    get playerVisibilityMode(): PlayerVisibilityMode {
        return this.encounterService.config.playerVisibilityMode;
    }
}