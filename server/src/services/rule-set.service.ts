import { RuleSetRepository } from '../db/repositories/ruleSet.repository';
import { RuleSetModel } from '../db/models/ruleSet.model';
import { CharacterSheetService } from './character-sheet.service';
import { CharacterSheetRepository } from '../db/repositories/characterSheet.repository';
import { CharacterSheetModel } from '../db/models/characterSheet.model';
import { UserRuleSetRepository } from '../db/repositories/user-ruleSet.repository';
import { CharacterRepository } from '../db/repositories/character.repository';
import { CharacterModel } from '../db/models/character.model';
import { CharacterService } from './character.service';
import { CampaignRepository } from '../db/repositories/campaign.repository';
import { CampaignModel } from '../db/models/campaign.model';
import { CampaignService } from './campaign.service';
import { CharacterAspectRepository } from '../db/repositories/characterAspect.repository';

export class RuleSetService {
	private ruleSetRepo: RuleSetRepository;
	private characterSheetRepo: CharacterSheetRepository;
	private characterRepo: CharacterRepository;
	private characterSheetService: CharacterSheetService;
	private userRuleSetRepo:  UserRuleSetRepository;
	private characterService: CharacterService;
	private campaignRepo: CampaignRepository;
	private campaignService: CampaignService;
	private aspectRepo: CharacterAspectRepository;

	constructor() {
		this.ruleSetRepo = new RuleSetRepository();
		this.characterSheetRepo = new CharacterSheetRepository();
		this.characterRepo = new CharacterRepository();
		this.characterSheetService = new CharacterSheetService();
		this.userRuleSetRepo = new UserRuleSetRepository();
		this.characterService = new CharacterService();
		this.campaignRepo = new CampaignRepository();
		this.campaignService = new CampaignService();
		this.aspectRepo = new CharacterAspectRepository();
	}

	public async createNewRuleSet(userId: string, label: string): Promise<RuleSetModel> {
		let ruleSetModel: RuleSetModel = await this.ruleSetRepo.create(label);
		ruleSetModel = await ruleSetModel.addAdmin(userId, 'superuser');
		await this.userRuleSetRepo.create(userId, ruleSetModel._id);
		return ruleSetModel;
	}

	public async getRuleSetJson(ruleSetId: string): Promise<Object> {
		try {
			const ruleSetModel: RuleSetModel = await this.ruleSetRepo.findById(ruleSetId);
			const characterSheetModels = await this.characterSheetRepo.findByRuleSetId(ruleSetId);
			const compiledSheets: any[] = [];
			for (let sheetModel of characterSheetModels) {
				const compiledSheet = await this.characterSheetService.getCompiledCharacterSheet(sheetModel._id);
				delete compiledSheet._id;
				for (let aspect of compiledSheet.aspects) {
					delete aspect._id;
				}
				compiledSheets.push(compiledSheet);
			}
			const npcs: any[] = [];
			const characterModels: CharacterModel[] = await this.characterRepo.findByRuleSetId(ruleSetId);
			for (let characterModel of characterModels) {
				let character: any = await this.characterService.getAssembledCharacter(characterModel._id);
				delete character._id;
				npcs.push(character);
			}
			return {
				label: ruleSetModel.label,
				config: ruleSetModel.config,
				admins: ruleSetModel.admins,
				characterSheets: compiledSheets,
				npcs: npcs,
			};
		}
		catch (error) {
			console.error(error);
			return {};
		}
	}

	public async createRuleSetFromJson(userId: string, jsonData: any): Promise<void> {
		let ruleSetModel: RuleSetModel = await this.ruleSetRepo.create(jsonData.label);
		ruleSetModel = await ruleSetModel.addAdmin(userId, 'superuser');
		ruleSetModel = await ruleSetModel.setConfig(jsonData.config);
		for (let sheetJson of jsonData.characterSheets) {
			const characterSheetModel: CharacterSheetModel = await this.characterSheetRepo.create(ruleSetModel._id, sheetJson.label);
			sheetJson._id = characterSheetModel._id;
			await this.characterSheetService.saveCharacterSheet(sheetJson);
		}
		for (let npc of jsonData.npcs) {
			const characterSheet = await this.characterSheetRepo.findByLabel(npc.characterSheet.label, ruleSetModel._id);
			let characterModel: CharacterModel = await this.characterService.createNewCharacter(userId, npc.label, characterSheet._id, npc.isNpc);
			await characterModel.setValues(npc.values);
			await characterModel.setTokenUrl(npc.tokenUrl)
		}
		await this.userRuleSetRepo.create(userId, ruleSetModel._id);
		return;
	}

	public async deleteRuleSet(userId: string, ruleSetId: string): Promise<void> {
		await this.userRuleSetRepo.deleteAllByRuleSetId(ruleSetId);
		const campaignModels: CampaignModel[] = await this.campaignRepo.findByRuleSetId(ruleSetId);
		for (let campaign of campaignModels) {
			await this.campaignService.delete(userId, campaign._id, true);
		}
		const ruleSetNpcs: CharacterModel[] = await this.characterRepo.findByRuleSetId(ruleSetId);
		for (let npc of ruleSetNpcs) {
			await this.characterRepo.deleteById(npc._id);
		}
		const characterSheets: CharacterSheetModel[] = await this.characterSheetRepo.findByRuleSetId(ruleSetId);
		for (let sheet of characterSheets) {
			await this.characterSheetService.deleteById(sheet._id);
		}

		await this.ruleSetRepo.deleteById(ruleSetId);
		return;
	}
}