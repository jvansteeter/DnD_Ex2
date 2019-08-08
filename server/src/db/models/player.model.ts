import * as mongoose from 'mongoose';
import { PlayerData } from '../../../../shared/types/encounter/player.data';
import { MongooseModel } from './mongoose.model';
import { CharacterData } from '../../../../shared/types/character.data';
import { DamageData } from '../../../../shared/types/rule-set/damage.data';

export class PlayerModel extends MongooseModel implements PlayerData {
	public _id;
	encounterId: string;
	userId: string;
	activeTokenIndex: number;
	characterData: CharacterData;
	initiative: number;
	location: {x: number, y: number};
	isVisible: boolean;
	teams: string[];
	damageRequests: DamageData[];

	constructor() {
		super({
			encounterId: {type: String, required: true},
			userId: {type: String, required: true},
			activeTokenIndex: {type: Number, default: 0},
			characterData: {type: Object, required: true},
			initiative: Number,
			location: {type: Object, default: {x: 0, y: 0}},
			isVisible: {type: Boolean, default: false},
			teams: [String],
			damageRequests: {type: Array, of: Object, default: []}
		});

		this._id = this.methods._id;
		this.characterData = this.methods.characterData;
		this.userId = this.methods.userId;
		this.activeTokenIndex = this.methods.activeTokenIndex;
		this.initiative = this.methods.initiative;
		this.location = this.methods.location;
		this.isVisible = this.methods.isVisible;
		this.teams = this.methods.teams;

		this.methods.setLocation = this.setLocation;
		this.methods.setVisible = this.setVisible;
		this.methods.setTeams = this.setTeams;
	}

	public setLocation(x: number, y: number): Promise<PlayerModel> {
		this.location = {
			x: x,
			y: y
		};
		return this.save();
	}

	public setVisible(isVisible: boolean): Promise<PlayerModel> {
		this.isVisible = isVisible;
		return this.save();
	}

	public setTeams(teams: string[]): Promise<PlayerModel> {
		this.teams = teams;
		return this.save();
	}
}

mongoose.model('Player', new PlayerModel());