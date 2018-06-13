import { CampaignModel } from '../db/models/campaign.model';
import { Promise } from 'bluebird';
import { EncounterRepository } from "../db/repositories/encounter.repository";
import { EncounterModel } from "../db/models/encounter.model";
import { PlayerModel } from '../db/models/player.model';
import { PlayerData } from '../../../shared/types/encounter/player';

export class EncounterService {
	private encounterRespository: EncounterRepository;

	constructor() {
		this.encounterRespository = new EncounterRepository();
	}

	public create(hostId: string, label: string, campaignId: string): Promise<CampaignModel> {
		return new Promise((resolve, reject) => {
			this.encounterRespository.create(label, campaignId).then((encounterModel: EncounterModel) => {
				encounterModel.addGameMaster(hostId).then(() => {
					resolve();
				}).catch(error => reject(error));
			}).catch(error => reject(error));
		});
	}

	public getEncounter(encounterId: string): Promise<EncounterModel> {
		return new Promise<EncounterModel>((resolve, reject) => {
			this.encounterRespository.findById(encounterId).then((encounter: EncounterModel) => {
				resolve(encounter);
			}).catch(error => reject(error));
		});
	}

	public getAllForCampaignId(campaignId: string): Promise<EncounterModel[]> {
		return new Promise<EncounterModel[]>((resolve, reject) => {
			this.encounterRespository.findByCampaignId(campaignId).then((encounters: EncounterModel[]) => {
				resolve(encounters);
			}).catch(error => reject(error));
		});
	}

	public addPlayer(campaignId: string, player: PlayerData): Promise<PlayerModel> {

	}

	// private buildEncounterState(encounterData): EncounterState {
	//
	// }
}