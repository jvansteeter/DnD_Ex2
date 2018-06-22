import {Injectable} from '@angular/core';
import {XyPair} from '../geometry/xy-pair';
import {CellPolygonGroup} from '../shared/cell-polygon-group';

@Injectable()
export class BoardPlayerService {

    public player_rgbaCode_map: Map<string, string>;
    public player_visibility_map: Map<string, CellPolygonGroup>;
    private player_traversibility_maps: Map<string, Array<XyPair>>;

    constructor() {
        this.player_rgbaCode_map = new Map<string, string>();
        this.player_visibility_map = new Map<string, CellPolygonGroup>();
        this.player_traversibility_maps = new Map<string, Array<XyPair>>();
    }

    public addPlayer(){}

    public removePlayer(){}

    public movePlayer(id: string, location: XyPair) {
    }

    public updatePlayerVisibility(id: string, visibilityPolygon: CellPolygonGroup) {
        this.player_visibility_map.set(id, visibilityPolygon);
    }

}
