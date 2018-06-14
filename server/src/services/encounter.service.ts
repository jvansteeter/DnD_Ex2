import { CampaignModel } from '../db/models/campaign.model';
import { Promise } from 'bluebird';
import { EncounterRepository } from "../db/repositories/encounter.repository";
import { EncounterModel } from "../db/models/encounter.model";
import { PlayerModel } from '../db/models/player.model';
import { PlayerData } from '../../../shared/types/encounter/player';
import { PlayerRepository } from "../db/repositories/player.repository";

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

	public getEncounter(encounterId: string): Promise<EncounterModel> {
		return new Promise<EncounterModel>((resolve, reject) => {
			this.encounterRepo.findById(encounterId).then((encounter: EncounterModel) => {
				resolve(encounter);
			}).catch(error => reject(error));
		});
	}

	public getAllForCampaignId(campaignId: string): Promise<EncounterModel[]> {
		return new Promise<EncounterModel[]>((resolve, reject) => {
			this.encounterRepo.findByCampaignId(campaignId).then((encounters: EncounterModel[]) => {
				resolve(encounters);
			}).catch(error => reject(error));
		});
	}

	public async addPlayer(campaignId: string, player: PlayerData): Promise<PlayerModel> {
		const playerModel: PlayerModel = await this.playerRepo.create(player.name, player.tokenUrl, player.maxHp, player.speed);
		// this.
	}

	// private buildEncounterState(encounterData): EncounterState {
	//
	// }
}