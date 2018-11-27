import { CharacterSheetRepository } from '../db/repositories/characterSheet.repository';
import { CharacterAspectRepository } from '../db/repositories/characterAspect.repository';
import { CharacterAspectModel } from '../db/models/characterAspect.model';
import { CharacterSheetModel } from '../db/models/characterSheet.model';

export class CharacterSheetService {
	private sheetRepository: CharacterSheetRepository;
	private aspectRepository: CharacterAspectRepository;

	constructor() {
		this.sheetRepository = new CharacterSheetRepository();
		this.aspectRepository = new CharacterAspectRepository();
	}

	public async saveCharacterSheet(characterSheetObj: any): Promise<CharacterSheetModel> {
		let sheetModel: CharacterSheetModel = await this.sheetRepository.findById(characterSheetObj._id);
		let oldAspects = await this.aspectRepository.findByCharacterSheetId(sheetModel._id);
		let newAspects = characterSheetObj.aspects;
		for (let aspect of oldAspects) {
			await this.aspectRepository.deleteById(aspect._id);
		}
		for (let aspect of newAspects) {
			await this.aspectRepository.create(sheetModel._id, aspect);
		}

		sheetModel.tooltipConfig = characterSheetObj.tooltipConfig;
		return sheetModel.setTooltipConfig(characterSheetObj.tooltipConfig);
	}

	public async getCompiledCharacterSheet(id: string): Promise<any> {
		let characterSheet = await this.sheetRepository.findById(id);
		let characterSheetObj = JSON.parse(JSON.stringify(characterSheet));
		let aspects: CharacterAspectModel[] = await this.aspectRepository.findByCharacterSheetId(characterSheet._id);
		characterSheetObj.aspects = JSON.parse(JSON.stringify(aspects));
		return characterSheetObj;
	}
}
