import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { EncounterModel } from '../models/encounter.model';
import { NotationModel } from '../models/notation.model';
import { NotationData } from '../../../../shared/types/encounter/board/notation.data';

export class NotationRepository {
	private Notation: mongoose.Model<mongoose.Document>;

	constructor() {
		this.Notation = mongoose.model('Notation');
	}

	public async create(encounterId: string, userId: string): Promise<NotationModel> {
		return new Promise((resolve, reject) => {
			this.Notation.create({
				userId: userId,
				encounterId: encounterId,
			}, (error, notationModel: NotationModel) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(notationModel);
			});
		});
	}

	public findById(id: string): Promise<NotationModel> {
		return new Promise((resolve, reject) => {
			this.Notation.findById(id, (error, encounter) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(encounter);
			})
		});
	}

	public findByEncounterId(id: string): Promise<NotationModel[]> {
		return new Promise<EncounterModel[]>((resolve, reject) => {
			this.Notation.find({encounterId: id}, (error, notations: NotationModel[]) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(notations);
			})
		});
	}

	public deleteById(id: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.Notation.remove({_id: id}, (error) => {
				if (error) {
					reject(error);
					return;
				}

				resolve();
			});
		});
	}

	public async updateNotation(notationData: NotationData): Promise<void> {
		try {
			const notation: NotationModel = await this.findById(notationData._id);
			if (notation !== null) {
				await notation.setNotationData(notationData);
			}

			return;
		}
		catch (error) {
			throw error;
		}
	}
}
