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
import { RuleSetData } from '../../../shared/types/rule-set/rule-set.data';
import { RuleSetModulesConfigData } from '../../../shared/types/rule-set/rule-set-modules-config.data';
import { DamageTypeData } from "../../../shared/types/rule-set/damage-type.data";
import { UserRuleSetModel } from '../db/models/user-ruleSet.model';
import { UserModel } from '../db/models/user.model';
import { UserRepository } from '../db/repositories/user.repository';
import { UserData } from '../../../shared/types/user-data';
import { ConditionData } from '../../../shared/types/rule-set/condition.data';
import { CharacterSheetData } from '../../../shared/types/rule-set/character-sheet.data';

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
	private userRepo: UserRepository;

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
		this.userRepo = new UserRepository();
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
				const compiledSheet: CharacterSheetData = await this.characterSheetService.getCompiledCharacterSheet(sheetModel._id);
				delete compiledSheet._id;
				if (compiledSheet.aspects) {
					for (let aspect of compiledSheet.aspects) {
						delete aspect._id;
					}
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
				_id: ruleSetModel._id,
				label: ruleSetModel.label,
				modulesConfig: ruleSetModel.modulesConfig,
				admins: ruleSetModel.admins,
				characterSheets: compiledSheets,
				npcs: npcs,
			} as RuleSetData;
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
			await characterModel.setTokens(npc.tokens)
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

	public async setModulesConfig(userId: string, ruleSetId: string, config: RuleSetModulesConfigData): Promise<void> {
		let ruleSet: RuleSetModel = await this.ruleSetRepo.findById(ruleSetId);
		await ruleSet.setConfig(config);
		return;
	}

	public async setDamageTypes(userId: string, ruleSetId: string, damageTypes: DamageTypeData[]): Promise<void> {
		let ruleSet: RuleSetModel = await this.ruleSetRepo.findById(ruleSetId);
		await ruleSet.setDamageTypes(damageTypes);
		return;
	}

	public async setConditions(userId: string, ruleSetId: string, conditions: ConditionData[]): Promise<void> {
		let ruleSet: RuleSetModel = await this.ruleSetRepo.findById(ruleSetId);
		await ruleSet.setConditions(conditions);
		return;
	}

	public async addAdmins(userId: string, ruleSetId: string, adminUserIds: string[]): Promise<void> {
		const existingAdmins: UserRuleSetModel[] = await this.userRuleSetRepo.getAllByRuleSetId(ruleSetId);
		let authorized: boolean = false;
		for (let existingAdmin of existingAdmins) {
			if (existingAdmin.userId == userId) {
				authorized = true;
				break;
			}
		}

		if (!authorized) {
			throw new Error('Not Authorized');
		}

		for (let adminUserId of adminUserIds) {
			await this.userRuleSetRepo.create(adminUserId, ruleSetId);
		}

		return;
	}

	public async getAdmins(ruleSetId: string): Promise<UserData[]> {
		const userRuleSets: UserRuleSetModel[] = await this.userRuleSetRepo.getAllByRuleSetId(ruleSetId);
		const admins: UserData[] = [];

		for (let userRuleSet of userRuleSets) {
			let userModel: UserModel = await this.userRepo.findById(userRuleSet.userId);
			let userData = JSON.parse(JSON.stringify(userModel));
			delete userData.passwordHash;
			admins.push(userData);
		}

		return admins;
	}
}