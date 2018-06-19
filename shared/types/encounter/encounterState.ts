import {Wall} from '../../../client/src/app/board/map-objects/wall';
import {LightSource} from '../../../client/src/app/board/map-objects/light-source';
import {LightValue} from '../../../client/src/app/board/shared/enum/light-value';
import { PlayerData } from './player';

export interface EncounterStateData {
    _id: string;
    label: string;
    date: Date;
    campaignId: string;
    gameMasters: string[];
    players: PlayerData[];

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
    wallData: Object;
    playerWallsEnabled: boolean;

    /**************************************
     * LIGHT RELATED VARIABLES
     **************************************/
    lightSourceData: Object;
    lightEnabled: boolean;
    ambientLight: LightValue;
}
