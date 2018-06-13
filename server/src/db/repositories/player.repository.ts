import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { PlayerModel } from '../models/player.model';

export class PlayerRepository {
	private Player: mongoose.Model<mongoose.Document>;


	constructor() {
		this.Player = mongoose.model('Player');
	}

	public create(name: string, tokenUrl: string, hp: string, speed: number): Promise<Error | PlayerModel> {
		return new Promise(async (resolve, reject) => {
			try {
				const playerModel = await this.Player.create({
					name: name,
					tokenUrl: tokenUrl,
					maxHp: hp,
					hp: hp,
					speed: speed,
				});

				resolve(playerModel);
			}
			catch (error) {
				reject(error);
			}
		});
	}

	public findById(id: string): Promise<PlayerModel> {
		return new Promise(async (resolve, reject) => {
			try {
				const player = await this.Player.findById(id);
				resolve(player);
			}
			catch (error) {
				reject(error);
			}
		});
	}
}
