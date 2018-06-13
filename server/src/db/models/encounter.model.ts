import * as mongoose from 'mongoose';
import Promise from 'bluebird';
import {EncounterState} from '../../../../shared/types/encounter/encounterState';
import {Player} from '../../../../shared/types/encounter/player';
import {LightValue} from "../../../../client/src/app/board/shared/light-value";

export class EncounterModel extends mongoose.Schema implements EncounterState {
    public _id;
    public label: string;
    public date: Date;
    public campaignId: string;
    public gameMasters: string[];
    public players: Player[];

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

    constructor() {
        super({
            label: String,
            date: Date,
            campaignId: String,
            gameMasters: [String],
            players: [Object]
        });

        this._id = this.methods._id;
        this.label = this.methods.label;
        this.date = this.methods.date;
        this.campaignId = this.methods.campaignId;
        this.gameMasters = this.methods.gameMasters;
        this.players = this.methods.players;

        this.methods.addGameMaster = this.addGameMaster;
    }

    public addGameMaster(userId: string): Promise<EncounterModel> {
        this.gameMasters.push(userId);
        return this.save();
    }

    private save(): Promise<EncounterModel> {
        return new Promise((resolve, reject) => {
            this.methods.save((error, encounter: EncounterModel) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(encounter);
            })
        });
    }
}

mongoose.model('Encounter', new EncounterModel());