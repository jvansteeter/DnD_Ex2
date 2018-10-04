import * as mongoose from 'mongoose';
import { PlayerData } from '../../../../shared/types/encounter/player.data';
import { MongooseModel } from './mongoose.model';
import { CharacterData } from '../../../../shared/types/character.data';

export class PlayerModel extends MongooseModel implements PlayerData {
	public _id;
	encounterId: string;
	characterData: CharacterData;
	initiative: number;
	location: {x: number, y: number};

	constructor() {
		super({
			encounterId: {type: String, required: true},
			characterData: {type: Object, required: true},
			initiative: Number,
			location: {type: Object, default: {x: 0, y: 0}}
		});

		this._id = this.methods._id;
		this.characterData = this.methods.characterData;
		this.initiative = this.methods.initiative;
		this.location = this.methods.location;

		this.methods.setLocation = this.setLocation;
	}

	public setLocation(x: number, y: number): Promise<PlayerModel> {
		this.location = {
			x: x,
			y: y
		};
		return this.save();
	}
}

mongoose.model('Player', new PlayerModel());