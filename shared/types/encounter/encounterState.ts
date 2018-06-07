import {Player} from './player';
import {Wall} from '../../../client/src/app/board/map-objects/wall';
import {LightSource} from '../../../client/src/app/board/map-objects/light-source';
import {LightValue} from '../../../client/src/app/board/shared/light-value';

export interface EncounterState {
    _id: string;
    label: string;
    date: Date;
    campaignId: string;
    gameMasters: string[];
    players: Player[];

    /**************************************
     * GENERAL BOARD VARIABLES
     **************************************/
    cell_res: number;
    mapDimX: number;
    mapDimY: number;

    /**************************************
     * MAP VARIABLES
     **************************************/
    map_enabled: boolean;
    // some sort of map_url

    /**************************************
     * WALL RELATED VARIABLES
     **************************************/
    wallData: Map<string, Wall>;
    playerWallsEnabled: boolean;

    /**************************************
     * LIGHT RELATED VARIABLES
     **************************************/
    lightSourceData: Map<string, LightSource>;
    lightEnabled: boolean;
    ambientLight: LightValue;
}
