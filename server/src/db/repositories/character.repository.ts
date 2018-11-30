import * as mongoose from 'mongoose';
import { CharacterModel } from '../models/character.model';

export class CharacterRepository {
	private Character: mongoose.Model<mongoose.Document>;

	constructor() {
		this.Character = mongoose.model('Character');
	}

	public create(creatorUserId: string, label: string, characterSheetId: string, npc: boolean = true): Promise<CharacterModel> {
		return new Promise((resolve, reject) => {
			this.Character.create({
				label: label,
				creatorUserId: creatorUserId,
				characterSheetId: characterSheetId,
				npc: npc
			}, (error, npc: CharacterModel) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(npc);
			});
		});
	}

	public findById(id: string): Promise<CharacterModel> {
		return new Promise((resolve, reject) => {
			this.Character.findById(id, (error, character: CharacterModel) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(character);
			})
		});
	}

	public findByRuleSetId(ruleSetId: string): Promise<CharacterModel[]> {
		return new Promise((resolve, reject) => {
			this.Character.find({ruleSetId: ruleSetId}, (error, characters: CharacterModel[]) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(characters);
			});
		});
	}

	public findByCampaignId(campaignId: string, npc: boolean): Promise<CharacterModel[]> {
		return new Promise((resolve, reject) => {
			this.Character.find({campaignId: campaignId, npc: npc}, (error, characters: CharacterModel[]) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(characters);
			});
		});
	}

	public findBySheetId(sheetId: string): Promise<CharacterModel[]> {
		return new Promise((resolve, reject) => {
			this.Character.find({characterSheetId: sheetId}, (error, characters: CharacterModel[]) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(characters);
			});
		});
	}

	public deleteById(characterId: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.Character.remove({_id: characterId}, (error) => {
				if (error) {
					reject(error);
					return;
				}

				resolve();
			})
		});
	}
}
