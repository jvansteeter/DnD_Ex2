import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { CharacterAspectModel } from '../models/characterAspect.model';
import { AspectData } from '../../../../shared/types/rule-set/aspect.data';

export class CharacterAspectRepository {
	private CharacterAspect: mongoose.Model<mongoose.Document>;

	constructor() {
		this.CharacterAspect = mongoose.model('CharacterAspect');
	}

	public create(characterSheetId: string, characterAspectObj: AspectData): Promise<Error | CharacterAspectModel> {
		return new Promise((resolve, reject) => {
			this.CharacterAspect.create({
				characterSheetId: characterSheetId,
				label: characterAspectObj.label,
				aspectType: characterAspectObj.aspectType,
				required: characterAspectObj.required,
				isPredefined: characterAspectObj.isPredefined,
				fontSize: characterAspectObj.fontSize,
				config: characterAspectObj.config,
				ruleFunction: characterAspectObj.ruleFunction
			}, async (error, newCharacterAspect: CharacterAspectModel) => {
				if (error) {
					reject(error);
					return;
				}
				if (characterAspectObj.hasOwnProperty('items')) {
					await newCharacterAspect.setItems(characterAspectObj.items);
				}
				resolve(newCharacterAspect);
			});
		});
	}

	public async findById(id: string): Promise<CharacterAspectModel> {
		return new Promise((resolve, reject) => {
			this.CharacterAspect.findById(id, (error, characterAspect: CharacterAspectModel) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(characterAspect);
			});
		});
	}

	public async update(aspect: AspectData): Promise<CharacterAspectModel> {
		try {
			let aspectModel: CharacterAspectModel = await this.findById(aspect._id);
			return aspectModel.setToObject(aspect);
		}
		catch (error) {
			throw error;
		}
	}

	public findByCharacterSheetId(id: string): Promise<CharacterAspectModel[]> {
		return new Promise((resolve, reject) => {
			this.CharacterAspect.find({characterSheetId: id}, (error, aspects: CharacterAspectModel[]) => {
				if (error) {
					reject(error);
					return;
				}
				// aspects.sort(this.orderByConfigCol);

				resolve(aspects);
			});
		});
	}

	public removeByCharacterSheetId(id: string): Promise<CharacterAspectModel[]> {
		return new Promise((resolve, reject) => {
			this.CharacterAspect.remove({characterSheetId: id}, (error) => {
				if (error) {
					reject(error);
					return;
				}

				resolve();
			});
		});
	}

	public deleteById(id: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.CharacterAspect.remove({_id: id}, (error) => {
				if (error) {
					reject(error);
					return;
				}

				resolve();
			})
		})
	}

	private orderByConfigCol(a, b): number {
		if (a.config.row < b.config.row) {
			return -1;
		}
		else if (a.config.row > b.config.row) {
			return 1;
		}

		return 0;
	}
}