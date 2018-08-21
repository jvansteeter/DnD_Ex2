import { CampaignModel } from '../db/models/campaign.model';
import { EncounterRepository } from "../db/repositories/encounter.repository";
import { EncounterModel } from "../db/models/encounter.model";
import { PlayerRepository } from "../db/repositories/player.repository";
import { EncounterData } from '../../../shared/types/encounter/encounter.data';
import { CharacterData } from '../../../shared/types/character.data';
import { CharacterService } from './character.service';
import { CharacterSheetRepository } from '../db/repositories/characterSheet.repository';

export class EncounterService {
	private encounterRepo: EncounterRepository;
	private playerRepo: PlayerRepository;
	private characterSheetRepo: CharacterSheetRepository;
	private characterService: CharacterService;

	constructor() {
		this.encounterRepo = new EncounterRepository();
		this.playerRepo = new PlayerRepository();
		this.characterSheetRepo = new CharacterSheetRepository();
		this.characterService = new CharacterService();
	}

	public create(hostId: string, label: string, campaignId: string): Promise<CampaignModel> {
		return new Promise((resolve, reject) => {
			this.encounterRepo.create(label, campaignId).then((encounterModel: EncounterModel) => {
				encounterModel.addGameMaster(hostId).then(() => {
					resolve();
				}).catch(error => reject(error));
			}).catch(error => reject(error));
		});
	}

	public async getEncounter(encounterId: string): Promise<EncounterData> {
		try {
			const encounter = await this.encounterRepo.findById(encounterId);
			const encounterState = await this.buildEncounterState(encounter);
			return encounterState;
		}
		catch (error) {
			throw error;
		}
	}

	public async setEncounter(encounterData: EncounterData): Promise<EncounterModel> {
		try {
			const encounterModel = await this.encounterRepo.findById(encounterData._id);
			return await encounterModel.setEncounterState(encounterData);
		}
		catch (error) {
			throw error;
		}
	}

	public getAllForCampaignId(campaignId: string): Promise<EncounterModel[]> {
		return new Promise<EncounterModel[]>((resolve, reject) => {
			this.encounterRepo.findByCampaignId(campaignId).then((encounters: EncounterModel[]) => {
				resolve(encounters);
			}).catch(error => reject(error));
		});
	}

	// public async addPlayer(encounterId: string, player: PlayerData): Promise<PlayerModel> {
	// 	try {
	// 		const playerModel: PlayerModel = await this.playerRepo.create(player.name, player.tokenUrl, player.maxHp, player.speed);
	// 		const encounterModel: EncounterModel = await this.encounterRepo.findById(encounterId);
	// 		await encounterModel.addPlayer(playerModel);
	// 		return playerModel;
	// 	}
	// 	catch (error) {
	// 		throw error;
	// 	}
	// }

	public async addCharacters(encounterId: string, characters: CharacterData[]): Promise<void> {
		try {
			let encounter: EncounterModel = await this.encounterRepo.findById(encounterId);
			for (let character of characters) {
				let player = await this.playerRepo.create(encounterId, character);
				await encounter.addPlayer(player);
				// TODO: send an MQ message to the encounter of an added player
			}

			return;
		}
		catch (error) {
			throw error;
		}
	}

	private async buildEncounterState(encounterModel: EncounterModel): Promise<EncounterData> {
		let encounterState: EncounterData = JSON.parse(JSON.stringify(encounterModel));
		encounterState.players = [];
		for (let playerId of encounterModel.playerIds) {
			const playerData = await this.playerRepo.findById(playerId);
			playerData.characterData.characterSheet = await this.characterSheetRepo.findById(playerData.characterData.characterSheetId);
			encounterState.players.push(playerData);
		}
		delete encounterState['playerIds'];
		return encounterState;
	}
}