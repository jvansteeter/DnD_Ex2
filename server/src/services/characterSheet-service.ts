import { CharacterSheetRepository } from '../db/repositories/characterSheet.repository';
import { CharacterAspectRepository } from '../db/repositories/characterAspect.repository';

export class CharacterSheetService {
	private sheetRepository: CharacterSheetRepository;
	private aspectRepository: CharacterAspectRepository;

	constructor() {
		this.sheetRepository = new CharacterSheetRepository();
		this.aspectRepository = new CharacterAspectRepository();
	}

	public async saveCharacterSheet(characterSheetObj: any): Promise<void> {
		try {
			let sheetModel = await this.sheetRepository.findById(characterSheetObj._id);
			let oldAspects = await this.aspectRepository.findByCharacterSheetId(sheetModel._id);
			let newAspects = characterSheetObj.aspects;
			for (let aspect of oldAspects) {
				await this.aspectRepository.deleteById(aspect._id);
			}
			for (let aspect of newAspects) {
				await this.aspectRepository.create(sheetModel._id, aspect);
			}

			return;
		}
		catch (error) {
			throw error;
		}
	}
}
