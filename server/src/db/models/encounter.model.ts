import * as mongoose from 'mongoose';
import { LightValue } from "../../../../client/src/app/board/shared/enum/light-value";
import { MongooseModel } from './mongoose.model';
import { Schema } from 'mongoose';
import { EncounterData } from '../../../../shared/types/encounter/encounter.data';
import { PlayerData } from '../../../../shared/types/encounter/player.data';
import { LightSourceData } from '../../../../shared/types/encounter/board/light-source.data';

export class EncounterModel extends MongooseModel implements EncounterData {
	public _id;
	public version: number;
	public label: string;
	public date: Date;
	public campaignId: string;
	public gameMasters: string[];
	public players: PlayerData[];
	public playerIds: string[];
	public isOpen: boolean;

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
	lightSources: LightSourceData[];
	lightEnabled: boolean;
	ambientLight: LightValue;

	constructor() {
		super({
			label: {type: String, required: true},
      version: {type: Number, default: 0},
			date: {type: Date, required: true},
			campaignId: {type: String, required: true},
			gameMasters: [String],
			playerIds: [Schema.Types.ObjectId],
			isOpen: {type: Boolean, default: false},
			mapUrl: String,
			mapDimX: Number,
			mapDimY: Number,
			lightSources: [{
				location: {
					x: Number,
					y: Number
				},
				bright_range: Number,
				dim_range: Number
			}],
		});

		this._id = this.methods._id;
		this.version = this.methods.version;
		this.label = this.methods.label;
		this.date = this.methods.date;
		this.campaignId = this.methods.campaignId;
		this.gameMasters = this.methods.gameMasters;
		this.players = [];
		this.playerIds = this.methods.playerIds;
		this.isOpen = this.methods.isOpen;
		this.mapUrl = this.methods.mapUrl;
		this.mapDimX = this.methods.mapDimX;
		this.mapDimY = this.methods.mapDimY;
		this.lightSources = this.methods.lightSources;

		this.methods.addGameMaster = this.addGameMaster;
		this.methods.addPlayer = this.addPlayer;
		this.methods.removePlayer = this.removePlayer;
		this.methods.setMapUrl = this.setMapUrl;
		this.methods.setIsOpen = this.setIsOpen;
		this.methods.incrementVersion = this.incrementVersion;
		this.methods.setLightSources = this.setLightSources;
	}

	public addGameMaster(userId: string): Promise<EncounterModel> {
		this.gameMasters.push(userId);
		return this.save();
	}

	public addPlayer(player: PlayerData): Promise<EncounterModel> {
		this.playerIds.push(player._id);
		return this.save();
	}

	public removePlayer(player: PlayerData): Promise<EncounterModel> {
		for (let i = 0; i < this.playerIds.length; i++) {
			if (this.playerIds[i] == player._id) {
				this.playerIds.splice(i, 1);
				break;
			}
		}

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

	public setMapUrl(url: string): Promise<EncounterModel> {
		this.mapUrl = url;
		return this.save();
	}

	public setIsOpen(isOpen: boolean): Promise<EncounterModel> {
		this.isOpen = isOpen;
		return this.save();
	}

	public incrementVersion(): Promise<EncounterModel> {
		this.version++;
		return this.save();
	}

	public setLightSources(lights: LightSourceData[]): Promise<EncounterModel> {
		this.lightSources.splice(0, this.lightSources.length);
		for (let light of lights) {
			this.lightSources.push(light);
		}
		return this.save();
	}
}

mongoose.model('Encounter', new EncounterModel());