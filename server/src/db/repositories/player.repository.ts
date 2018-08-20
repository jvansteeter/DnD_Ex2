import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { PlayerModel } from '../models/player.model';
import { PlayerData } from '../../../../shared/types/encounter/player.data';
import { CharacterData } from '../../../../shared/types/character.data';

export class PlayerRepository {
	private Player: mongoose.Model<mongoose.Document>;

	constructor() {
		this.Player = mongoose.model('Player');
	}

	public create(encounterId: string, character: CharacterData): Promise<PlayerModel> {
		return new Promise(async (resolve, reject) => {
			try {
				const playerModel = await this.Player.create({
					encounterId: encounterId,
					characterData: character,
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
