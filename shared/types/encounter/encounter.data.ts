import {LightValue} from '../../../client/src/app/board/shared/enum/light-value';
import { PlayerData } from './player.data';

export interface EncounterData {
    _id: string;
    version: number;
    label: string;
    date: Date;
    campaignId: string;
    gameMasters: string[];
    playerIds: string[];
    players?: PlayerData[];
    isOpen: boolean;

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
    mapUrl: string;

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
