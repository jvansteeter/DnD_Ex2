import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { PlayerModel } from '../models/player.model';
import { PlayerData } from '../../../../shared/types/encounter/player';

export class PlayerRepository {
	private Player: mongoose.Model<mongoose.Document>;

	constructor() {
		this.Player = mongoose.model('Player');
	}

	public create(name: string, tokenUrl: string, hp: number, speed: number): Promise<PlayerModel> {
		return new Promise(async (resolve, reject) => {
			try {
				const playerModel = await this.Player.create({
					name: name,
					tokenUrl: tokenUrl,
					maxHp: hp,
					hp: hp,
					speed: speed,
					location: {x: 0, y: 0}
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

	public async updatePlayer(playerData: PlayerData): Promise<PlayerModel> {
		try {
			let player = await this.findById(playerData._id);
			if (!player) {
				throw new Error('Cannot find User');
			}
			for (let item in playerData) {
				player[item] = playerData[item];
			}
			return await player.save();
		}
		catch (error) {
			throw error;
		}
	}
}
