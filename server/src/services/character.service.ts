import { CharacterRepository } from '../db/repositories/character.repository';
import { RuleSetRepository } from '../db/repositories/ruleSet.repository';
import { CampaignRepository } from '../db/repositories/campaign.repository';
import { CharacterData } from '../../../shared/types/character.data';
import { CharacterSheetData } from '../../../shared/types/rule-set/character-sheet.data';
import { CharacterSheetService } from './character-sheet.service';
import { CharacterModel } from '../db/models/character.model';
import { CharacterSheetRepository } from '../db/repositories/characterSheet.repository';
import { CharacterSheetModel } from '../db/models/characterSheet.model';

export class CharacterService {
	private characterRepo: CharacterRepository;
	private ruleSetRepo: RuleSetRepository;
	private campaignRepo: CampaignRepository;
	private characterSheetRepo: CharacterSheetRepository;
	private characterSheetService: CharacterSheetService;

	constructor() {
		this.characterRepo = new CharacterRepository();
		this.ruleSetRepo = new RuleSetRepository();
		this.campaignRepo = new CampaignRepository();
		this.characterSheetRepo = new CharacterSheetRepository();
		this.characterSheetService = new CharacterSheetService();
	}

	public async createNewCharacter(userId: string, label: string, sheetId: string, isNpc: boolean, campaignId?: string): Promise<CharacterModel> {
		let characterModel: CharacterModel = await this.characterRepo.create(userId, label, sheetId, isNpc);
		if (!!campaignId) {
			characterModel = await characterModel.setCampaignId(campaignId);
		}
		else {
			let characterSheetModel: CharacterSheetModel = await this.characterSheetRepo.findById(sheetId);
			characterModel = await characterModel.setRuleSetId(characterSheetModel.ruleSetId);
		}
		return characterModel;
	}

	public async getAllByCampaignId(campaignId: string): Promise<{}> {
		try {
			let campaign = await this.campaignRepo.findById(campaignId);
			let ruleSet = await this.ruleSetRepo.findById(campaign.ruleSetId);
			let campaignCharacters = await this.characterRepo.findByCampaignId(campaignId, false);
			let ruleSetNPCs = await this.characterRepo.findByRuleSetId(ruleSet._id);
			return {
				campaignCharacters: campaignCharacters,
				ruleSetNPCs: ruleSetNPCs
			};
		}
		catch (error) {
			throw error;
		}
	}

	public async deleteCharacter(characterId: string): Promise<void> {
		try {
			await this.characterRepo.deleteById(characterId);
			return;
		}
		catch (error) {
			throw error;
		}
	}

	public async getAssembledCharacter(characterId: string): Promise<any> {
		let character: CharacterData = JSON.parse(JSON.stringify(await this.characterRepo.findById(characterId)));
		let characterSheet: CharacterSheetData = JSON.parse(JSON.stringify(await this.characterSheetService.getCompiledCharacterSheet(character.characterSheetId)));
		character.characterSheet = characterSheet;
		return character;
	}
}
