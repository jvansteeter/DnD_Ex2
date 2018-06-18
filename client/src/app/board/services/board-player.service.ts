import {Injectable} from '@angular/core';
import {XyPair} from '../geometry/xy-pair';
import {EncounterService} from '../../encounter/encounter.service';
import {CellVisibilityState} from '../shared/cell-visibility-state';

@Injectable()
export class BoardPlayerService {

    private player_visibility_map: Map<string, Array<CellVisibilityState>>;
    private player_traversibility_maps: Map<string, Array<XyPair>>;

    constructor(
        private encounterService: EncounterService
    ) {
    }

    public addPlayer(){}

    public removePlayer(){}

    public movePlayer(id: string, location: XyPair) {
    }

}
