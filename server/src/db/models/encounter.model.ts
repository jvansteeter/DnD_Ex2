import * as mongoose from 'mongoose';
import { LightValue } from "../../../../client/src/app/board/shared/enum/light-value";
import { MongooseModel } from './mongoose.model';
import { Schema } from 'mongoose';
import { EncounterData } from '../../../../shared/types/encounter/encounter.data';
import { PlayerData } from '../../../../shared/types/encounter/player.data';

export class EncounterModel extends MongooseModel implements EncounterData {
	public _id;
	public version: number;
	public label: string;
	public date: Date;
	public campaignId: string;
	public gameMasters: string[];
	public players: PlayerData[];
	public playerIds: string[];

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
      version: {type: Number, default: 0},
			date: Date,
			campaignId: String,
			gameMasters: [String],
			playerIds: [Schema.Types.ObjectId]
		});

		this._id = this.methods._id;
		this.version = this.methods.version;
		this.label = this.methods.label;
		this.date = this.methods.date;
		this.campaignId = this.methods.campaignId;
		this.gameMasters = this.methods.gameMasters;
		this.players = [];
		this.playerIds = this.methods.playerIds;

		this.methods.addGameMaster = this.addGameMaster;
		this.methods.addPlayer = this.addPlayer;
	}

	public addGameMaster(userId: string): Promise<EncounterModel> {
		this.gameMasters.push(userId);
		return this.save();
	}

	public addPlayer(player: PlayerData): Promise<EncounterModel> {
		this.playerIds.push(player._id);
		return this.save();
	}

	public setEncounterState(encounterState: EncounterData): Promise<EncounterModel> {
		let playerIds: string[] = [];
		if (!!encounterState.players) {
			for (let player of encounterState.players) {
				playerIds.push(player._id);
			}
		}
		for (let item in encounterState) {
			this[item] = encounterState[item];
		}
		this.playerIds = playerIds;
		return this.save();
	}
}

mongoose.model('Encounter', new EncounterModel());