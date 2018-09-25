import { CharacterRepository } from '../db/repositories/character.repository';
import { RuleSetRepository } from '../db/repositories/ruleSet.repository';
import { CampaignRepository } from '../db/repositories/campaign.repository';
import { PlayerData } from '../../../shared/types/encounter/player.data';
import { CharacterData } from '../../../shared/types/character.data';

export class CharacterService {
	private characterRepo: CharacterRepository;
	private ruleSetRepo: RuleSetRepository;
	private campaignRepo: CampaignRepository;

	constructor() {
		this.characterRepo = new CharacterRepository();
		this.ruleSetRepo = new RuleSetRepository();
		this.campaignRepo = new CampaignRepository();
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

	// public async createPlayerDataFromCharacter(characterId: string): Promise<PlayerData> {
	// 	try {
	// 		let character: CharacterData = await this.characterRepo.findById(characterId);
	// 		let data = {
	// 			_id: '',
	// 			location: {
	// 				x: 0,
	// 				y: 0
	// 			}
	// 		};
	// 		for (let item in character.values) {
	// 			if (item.toLowerCase() === 'name') {
	// 				data['name'] = character.values[item];
	// 			}
	// 			if (item.toLowerCase() === 'map token') {
	// 				data['tokenUrl'] = character.values[item];
	// 			}
	// 			if (item.toLowerCase() === 'health') {
	// 				data['maxHp'] = character.values[item];
	// 				data['hp'] = character.values[item];
	// 			}
	// 			if (item.toLowerCase() === 'speed') {
	// 				data['speed'] = character.values[item];
	// 			}
	// 		}
	//
	// 		return data;
	// 	}
	// 	catch (error) {
	// 		throw error;
	// 	}
	// }
}
