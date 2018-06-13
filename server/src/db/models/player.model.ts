import * as mongoose from 'mongoose';
import { PlayerData } from '../../../../shared/types/encounter/player';


export class PlayerModel extends mongoose.Schema implements PlayerData {
	public _id;
	name: string;
	tokenUrl: string;
	maxHp: number;
	hp: number;
	speed: number;
	location: Object;

	constructor() {
		super({
			name: {type: String, required: true, default: '' },
			tokenUrl: {type: String, required: true},
			maxHp: {type: Number, required: true, default: 1},
			hp: {type: Number, required: true, default: 1},
			speed: {type: Number, required: true, default: 1},
			location: Object
		});

		this._id = this.methods._id;
		this.name = this.methods.name;
		this.tokenUrl = this.methods.tokenUrl;
		this.maxHp = this.methods.maxHp;
		this.hp = this.methods.hp;
		this.speed = this.methods.speed;
		this.location = this.methods.location;
	}

	private save(): Promise<PlayerModel> {
		return new Promise((resolve, reject) => {
			this.methods.save((error, encounter: PlayerModel) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(encounter);
			})
		});
	}
}

mongoose.model('Player', new PlayerModel());