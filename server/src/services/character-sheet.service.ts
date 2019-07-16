import { CharacterSheetRepository } from '../db/repositories/characterSheet.repository';
import { CharacterAspectRepository } from '../db/repositories/characterAspect.repository';
import { CharacterAspectModel } from '../db/models/characterAspect.model';
import { CharacterSheetModel } from '../db/models/characterSheet.model';
import { CharacterRepository } from '../db/repositories/character.repository';
import { CharacterModel } from '../db/models/character.model';
import { CharacterSheetData } from '../../../shared/types/rule-set/character-sheet.data';
import { isNullOrUndefined } from 'util';

export class CharacterSheetService {
	private sheetRepo: CharacterSheetRepository;
	private aspectRepo: CharacterAspectRepository;
	private characterRepo: CharacterRepository;

	constructor() {
		this.sheetRepo = new CharacterSheetRepository();
		this.aspectRepo = new CharacterAspectRepository();
		this.characterRepo = new CharacterRepository();
	}

	public async saveCharacterSheet(characterSheetObj: any): Promise<CharacterSheetModel> {
		let sheetModel: CharacterSheetModel = await this.sheetRepo.findById(characterSheetObj._id);
		await this.aspectRepo.removeByCharacterSheetId(sheetModel._id);
		let newAspects = characterSheetObj.aspects;
		for (let aspect of newAspects) {
			await this.aspectRepo.create(sheetModel._id, aspect);
		}

		sheetModel = await sheetModel.setTooltipConfig(characterSheetObj.tooltipConfig);
		if (!isNullOrUndefined(characterSheetObj.abilities)) {
			sheetModel = await sheetModel.setAbilities(characterSheetObj.abilities);
		}

		return sheetModel;
	}

	public async getCompiledCharacterSheet(id: string): Promise<CharacterSheetData> {
		let characterSheet = await this.sheetRepo.findById(id);
		let characterSheetObj = JSON.parse(JSON.stringify(characterSheet));
		let aspects: CharacterAspectModel[] = await this.aspectRepo.findByCharacterSheetId(characterSheet._id);
		characterSheetObj.aspects = JSON.parse(JSON.stringify(aspects));
		return characterSheetObj;
	}

	public async deleteById(id: string): Promise<void> {
		await this.aspectRepo.removeByCharacterSheetId(id);
		await this.sheetRepo.deleteById(id);
		const characters: CharacterModel[] = await this.characterRepo.findBySheetId(id);
		await characters.forEach((character: CharacterModel) => {
			this.characterRepo.deleteById(character._id);
		});
		return;
	}
}
