import * as mongoose from 'mongoose';
import { CharacterSheetModel } from '../models/characterSheet.model';
import { CharacterAspectRepository } from './characterAspect.repository';

export class CharacterSheetRepository {
	private CharacterSheet: mongoose.Model<mongoose.Document>;
	private characterAspectRepository: CharacterAspectRepository;

	constructor() {
		this.CharacterSheet = mongoose.model('CharacterSheet');
		this.characterAspectRepository = new CharacterAspectRepository();
	}

	public create(ruleSetId: string, label: string): Promise<CharacterSheetModel> {
		return new Promise((resolve, reject) => {
			this.CharacterSheet.create({
				ruleSetId: ruleSetId,
				label: label,
			}, (error, newCharacterSheet: CharacterSheetModel) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(newCharacterSheet);
			});
		});
	}

	public findById(id: string): Promise<CharacterSheetModel> {
		return new Promise((resolve, reject) => {
			this.CharacterSheet.findById(id, (error, characterSheet: CharacterSheetModel) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(characterSheet);
			});
		});
	}

	public findByLabel(label: string, ruleSetId: string): Promise<CharacterSheetModel> {
		return new Promise((resolve, reject) => {
			this.CharacterSheet.findOne({label: label, ruleSetId: ruleSetId}, (error, characterSheet: CharacterSheetModel) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(characterSheet);
			});
		});
	}

	public getAllForRuleSet(ruleSetId: string): Promise<CharacterSheetModel[]> {
		return new Promise((resolve, reject) => {
			this.CharacterSheet.find({ruleSetId: ruleSetId}, (error, characterSheets: CharacterSheetModel[]) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(characterSheets);
			});
		});
	}
}