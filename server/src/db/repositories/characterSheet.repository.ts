import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { CharacterSheetModel } from '../models/characterSheet.model';
import { CharacterAspectRepository } from './characterAspect.repository';
import { CharacterAspectModel } from '../models/characterAspect.model';

export class CharacterSheetRepository {
	private CharacterSheet: mongoose.Model<mongoose.Document>;
	private characterAspectRepository: CharacterAspectRepository;

	constructor() {
		this.CharacterSheet = mongoose.model('CharacterSheet');
		this.characterAspectRepository = new CharacterAspectRepository();
	}

	public create(ruleSetId: string, label: string): Promise<Error | CharacterSheetModel> {
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

	public async getCompiledCharacterSheet(id: string): Promise<any> {
		// return new Promise((resolve, reject) => {
		// 	let characterSheetObj;
		// 	this.findById(id).then((characterSheet: CharacterSheetModel) => {
		// 		characterSheetObj = JSON.parse(JSON.stringify(characterSheet));
		// 		characterSheetObj.aspects = [];
		// 		this.characterAspectRepository.findByCharacterSheetId(characterSheet._id).then((aspects: CharacterAspectModel[]) => {
		// 			let aspectCount = aspects.length;
		// 			if (aspectCount === 0) {
		// 				resolve(characterSheetObj);
		// 			}
		// 			aspects.forEach((aspect: CharacterAspectModel) => {
		// 				let aspectObj = JSON.parse(JSON.stringify(aspect));
		// 				if (aspect.aspectType === 'FUNCTION') {
		// 					this.ruleFunctionRepository.findById(aspect.ruleFunction).then((ruleFunction: RuleFunctionModel) => {
		// 						aspectObj.ruleFunction = JSON.parse(JSON.stringify(ruleFunction));
		// 						characterSheetObj.aspects.push(aspectObj);
		// 						if (--aspectCount === 0) {
		// 							resolve(characterSheetObj);
		// 						}
		// 					});
		// 				}
		// 				else {
		// 					characterSheetObj.aspects.push(aspectObj);
		// 					if (--aspectCount === 0) {
		// 						resolve(characterSheetObj);
		// 					}
		// 				}
		// 			});
		// 		});
		// 	}).catch((error) => reject(error));
		// });

		try {
			let characterSheet = await this.findById(id);
			let characterSheetObj = JSON.parse(JSON.stringify(characterSheet));
			let aspects: CharacterAspectModel[] = await this.characterAspectRepository.findByCharacterSheetId(characterSheet._id);
			characterSheetObj.aspects = JSON.parse(JSON.stringify(aspects));
			return characterSheetObj;
		}
		catch (error) {
			throw error;
		}
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