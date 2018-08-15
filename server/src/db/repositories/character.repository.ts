import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { UserRepository } from './user.repository';
import { CharacterModel } from '../models/character.model';

export class CharacterRepository {
	private Character: mongoose.Model<mongoose.Document>;

	private userRepository: UserRepository;

	constructor() {
		this.Character = mongoose.model('Character');
		this.userRepository = new UserRepository();
	}

	public create(label: string, creatorUserId: string, characterSheetId: string, npc: boolean = true): Promise<Error | CharacterModel> {
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
			this.Character.findById(id, (error, ruleSet) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(ruleSet);
			})
		});
	}

	public findAllForRuleSet(ruleSetId: string): Promise<CharacterModel[]> {
		return new Promise((resolve, reject) => {
			this.Character.find({ruleSetId: ruleSetId}, (error, npcs: CharacterModel[]) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(npcs);
			});
		});
	}
}
