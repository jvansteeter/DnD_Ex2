import { CampaignModel } from '../db/models/campaign.model';
// import { Promise } from 'bluebird';
import { EncounterRepository } from "../db/repositories/encounter.repository";
import { EncounterModel } from "../db/models/encounter.model";
import { PlayerModel } from '../db/models/player.model';
import { PlayerData } from '../../../shared/types/encounter/player';
import { PlayerRepository } from "../db/repositories/player.repository";
import { EncounterStateData } from '../../../shared/types/encounter/encounterState';

export class EncounterService {
	private encounterRepo: EncounterRepository;
	private playerRepo: PlayerRepository;

	constructor() {
		this.encounterRepo = new EncounterRepository();
		this.playerRepo = new PlayerRepository();
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

	public async getEncounter(encounterId: string): Promise<EncounterStateData> {
		try {
			const encounter = await this.encounterRepo.findById(encounterId);
			const encounterState = await this.buildEncounterState(encounter);
			return encounterState;
		}
		catch (error) {
			throw error;
		}
	}

	public async setEncounter(encounterData: EncounterStateData): Promise<EncounterModel> {
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

	public async addPlayer(campaignId: string, player: PlayerData): Promise<PlayerModel> {
		try {
			const playerModel: PlayerModel = await this.playerRepo.create(player.name, player.tokenUrl, player.maxHp, player.speed);
			const encounterModel: EncounterModel = await this.encounterRepo.findById(campaignId);
			await encounterModel.addPlayer(playerModel);
			return playerModel;
		}
		catch (error) {
			throw error;
		}
	}

	private async buildEncounterState(encounterModel: EncounterModel): Promise<EncounterStateData> {
		console.log('buildEncounterState')
		let encounterState: EncounterStateData = JSON.parse(JSON.stringify(encounterModel));
		encounterState.players = [];
		for (let playerId of encounterModel.playerIds) {
			console.log('playerId: ', playerId);
			const playerData = await this.playerRepo.findById(playerId);
			console.log(playerData);
			encounterState.players.push(playerData);
		}
		delete encounterState['playerIds'];
		return encounterState;
	}
}