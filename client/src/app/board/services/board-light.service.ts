import {Injectable} from '@angular/core';
import {CellLightConfig} from '../shared/cell-light-state';
import {LightSource} from '../map-objects/light-source';
import {BoardStateService} from './board-state.service';
import {XyPair} from '../geometry/xy-pair';
import {BoardVisibilityService} from './board-visibility.service';
import {IsReadyService} from "../../utilities/services/isReady.service";

@Injectable()
export class BoardLightService extends IsReadyService {
    public cellLightData: Array<Array<CellLightConfig>>;

    public lightSourceData: Map<string, LightSource> = new Map();           // maps XyPair location hashes (should just be unique toString) toUserId LightSourceObjects

    constructor(
        private boardStateService: BoardStateService,
        private boardVisibilityService: BoardVisibilityService,
    ) {
        super(boardStateService);
        this.init();
    }

    public init(): void {
        this.dependenciesReady().subscribe((isReady: boolean) => {
            if (isReady) {
                this.cellLightData = new Array(this.boardStateService.mapDimX);
                for (let x = 0; x < this.boardStateService.mapDimX; x++) {
                    this.cellLightData[x] = new Array(this.boardStateService.mapDimY);
                    for (let y = 0; y < this.boardStateService.mapDimY; y++) {
                        this.cellLightData[x][y] = new CellLightConfig(x, y);
                    }
                }
                this.setReady(true);
            }
        })
    }

    addLightSource(source: LightSource) {
        this.lightSourceData.set(source.location.hash(), source);
        this.updateLightValues();
    }

    deleteLightSource(location: XyPair) {
        if (this.lightSourceData.has(location.hash())) {
            this.lightSourceData.delete(location.hash());
        }
        this.updateLightValues();
    }

    toggleLightSource(location: XyPair, source = new LightSource(location, 5)) {
        if (this.lightSourceData.has(location.hash())) {
            this.deleteLightSource(location);
        } else {
            this.addLightSource(source);
        }
    }

    updateLightValues(): void {
        for (let x = 0; x < this.boardStateService.mapDimX; x++) {
            for (let y = 0; y < this.boardStateService.mapDimY; y++) {
                // for each cell on the map
                const cell = this.cellLightData[x][y];

                // reset the ambient light values
                cell.light_north = this.boardStateService.ambientLight;
                cell.light_west = this.boardStateService.ambientLight;
                cell.light_south = this.boardStateService.ambientLight;
                cell.light_east = this.boardStateService.ambientLight;

                // set booleans for which cells have been touched
                let north = false;
                let west = false;
                let south = false;
                let east = false;

                // sort light sources by distance toUserId cell, removing any beyond influence distance
                const mapped_light_sources = new Map<number, Array<LightSource>>();
                for (const light_source of Array.from(this.lightSourceData.values())) {
                    const distance = BoardStateService.distanceCellToCell(new XyPair(cell.coor.x, cell.coor.y), light_source.location);
                    if (distance <= light_source.dim_range) {
                        if (!mapped_light_sources.has(distance)) {
                            mapped_light_sources.set(distance, new Array<LightSource>());
                        }
                        mapped_light_sources.get(distance).push(light_source);
                    }
                }

                const distances = Array.from(mapped_light_sources.keys()).sort((a, b) => {
                    if (a > b) {
                        return 1;
                    }
                    if (a < b) {
                        return -1;
                    }
                    return 0;
                });

                for (const dist of distances) {
                    for (const light_source of mapped_light_sources.get(dist)) {
                        if (!(north && east && south && west)) {
                            if (!north) {
                                if (this.boardVisibilityService.cellHasLOSTo_TopQuad(light_source.location, cell.coor)) {
                                    cell.updateLightIntensityNorth(light_source.lightImpactAtDistance(dist));
                                    north = true;
                                }
                            }
                            if (!east) {
                                if (this.boardVisibilityService.cellHasLOSTo_RightQuad(light_source.location, cell.coor)) {
                                    cell.updateLightIntensityEast(light_source.lightImpactAtDistance(dist));
                                    east = true;
                                }
                            }
                            if (!south) {
                                if (this.boardVisibilityService.cellHasLOSTo_BottomQuad(light_source.location, cell.coor)) {
                                    cell.updateLightIntensitySouth(light_source.lightImpactAtDistance(dist));
                                    south = true;
                                }
                            }
                            if (!west) {
                                if (this.boardVisibilityService.cellHasLOSTo_LeftQuad(light_source.location, cell.coor)) {
                                    cell.updateLightIntensityWest(light_source.lightImpactAtDistance(dist));
                                    west = true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}