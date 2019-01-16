import { EncounterRepository } from "../db/repositories/encounter.repository";
import { EncounterModel } from "../db/models/encounter.model";
import { PlayerRepository } from "../db/repositories/player.repository";
import { EncounterData } from '../../../shared/types/encounter/encounter.data';
import { CharacterData } from '../../../shared/types/character.data';
import { CharacterService } from './character.service';
import { CharacterSheetRepository } from '../db/repositories/characterSheet.repository';
import { MqServiceSingleton } from '../mq/mq.service';
import { EncounterCommandType } from '../../../shared/types/encounter/encounter-command.enum';
import { PlayerData } from '../../../shared/types/encounter/player.data';
import { LightSourceData } from '../../../shared/types/encounter/board/light-source.data';
import { NotationData } from '../../../shared/types/encounter/board/notation.data';
import { NotationRepository } from '../db/repositories/notation.repository';
import { NotationModel } from '../db/models/notation.model';
import { EncounterConfigData } from '../../../shared/types/encounter/encounter-config.data';
import { LightValue } from '../../../shared/types/encounter/board/light-value';
import { PlayerVisibilityMode } from '../../../shared/types/encounter/board/player-visibility-mode';
import { EncounterTeamsData } from '../../../shared/types/encounter/encounter-teams.data';
import { UserRepository } from '../db/repositories/user.repository';
import { UserModel } from '../db/models/user.model';
import { UserCampaignModel } from '../db/models/user-campaign.model';
import { UserCampaignRepository } from '../db/repositories/user-campaign.repository';

export class EncounterService {
	private encounterRepo: EncounterRepository;
	private playerRepo: PlayerRepository;
	private characterSheetRepo: CharacterSheetRepository;
	private characterService: CharacterService;
	private notationRepo: NotationRepository;
	private userRepo: UserRepository;
	private userCampaignRepo: UserCampaignRepository;

	constructor() {
		this.encounterRepo = new EncounterRepository();
		this.playerRepo = new PlayerRepository();
		this.characterSheetRepo = new CharacterSheetRepository();
		this.characterService = new CharacterService();
		this.notationRepo = new NotationRepository();
		this.userRepo = new UserRepository();
		this.userCampaignRepo = new UserCampaignRepository();
	}

	public async create(hostId: string, label: string, campaignId: string, mapDimX: number, mapDimY: number, mapUrl?: string): Promise<EncounterModel> {
		try {
			let encounterModel: EncounterModel = await this.encounterRepo.create(label, campaignId, mapDimX, mapDimY);
			encounterModel = await this.setEncounterConfig(encounterModel._id, {
				lightEnabled: false,
				ambientLight: LightValue.FULL,
				playerVisibilityMode: PlayerVisibilityMode.PLAYER,
				mapEnabled: false,
				playerWallsEnabled: true,
				showHealth: false,
			});
			if (mapUrl) {
				encounterModel = await encounterModel.setMapUrl(mapUrl);
			}

			return encounterModel;
		}
		catch (error) {
			throw error;
		}
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

	public async addUserToEncounter(encounterId: string, userId: string): Promise<EncounterModel> {
		let encounter: EncounterModel = await this.encounterRepo.findById(encounterId);
		for (let user of encounter.teamsData.users) {
			if (user.userId == userId) {
				return encounter;
			}
		}

		const isGameMaster = await this.isGameMaster(userId, encounter);
		const teams = isGameMaster ? ['GM'] : ['Player'];
		console.log('add user to encounter')
		const userModel: UserModel = await this.userRepo.findById(userId);
		encounter = await encounter.addUser(userId, userModel.username, teams);
		return encounter;
	}

	public getAllForCampaignId(campaignId: string): Promise<EncounterModel[]> {
		return new Promise<EncounterModel[]>((resolve, reject) => {
			this.encounterRepo.findByCampaignId(campaignId).then((encounters: EncounterModel[]) => {
				resolve(encounters);
			}).catch(error => reject(error));
		});
	}

	public async addCharacters(encounterId: string, userId: string, characters: CharacterData[]): Promise<void> {
		let encounter: EncounterModel = await this.encounterRepo.findById(encounterId);
		const placementMap: boolean[][] = await this.getPlayerPlacementMap(encounter);
		let playerCount = 0;
		for (let character of characters) {
			let player = await this.playerRepo.create(encounterId, userId, character);
			let placed: boolean = false;
			let x;
			let y = 0;
			while (!placed && y < placementMap[0].length) {
				x = 0;
				while (!placed && x < placementMap.length) {
					if (placementMap[x][y] === false) {
						player = await player.setLocation(x, y);
						if (await this.isGameMaster(userId, encounter)) {
							player = await player.setTeams(['GM'])
						}
						else {
							player = await player.setTeams(['Player']);
						}
						playerCount++;
						await encounter.addPlayer(player);
						player.characterData.characterSheet = await this.characterSheetRepo.findById(player.characterData.characterSheetId);
						await MqServiceSingleton.sendEncounterCommand(encounterId, userId, EncounterCommandType.ADD_PLAYER, encounter.version + playerCount, player);
						placementMap[x][y] = true;
						placed = true;
					}
					x++;
				}
				y++;
			}
		}

		return;
	}

	public async deleteEncounter(encounterId: string): Promise<void> {
		try {
			const encounter: EncounterModel = await this.encounterRepo.findById(encounterId);
			if (encounter.playerIds) {
				for (let playerId of encounter.playerIds) {
					await this.playerRepo.deleteById(playerId);
				}
			}
			if (encounter.notationIds) {
				for (let notationId of encounter.notationIds) {
					await this.notationRepo.deleteById(notationId);
				}
			}
			await this.encounterRepo.deleteById(encounterId);
			return;
		}
		catch (error) {
			throw error;
		}
	}

	public async updateEncounterOpenStatus(encounterId: string, isOpen: boolean): Promise<EncounterModel> {
		try {
			const encounter = await this.encounterRepo.findById(encounterId);
			return await encounter.setIsOpen(isOpen);
		}
		catch (error) {
			throw error;
		}
	}

	public async deletePlayer(player: PlayerData, userId: string): Promise<void> {
		try {
			const encounter: EncounterModel = await this.encounterRepo.findById(player.encounterId);
			await encounter.removePlayer(player);
			await this.playerRepo.deleteById(player._id);
			await MqServiceSingleton.sendEncounterCommand(player.encounterId, userId, EncounterCommandType.REMOVE_PLAYER, encounter.version + 1, player);
			return;
		}
		catch (error) {
			throw error;
		}
	}

	public async getVersion(encounterId: string): Promise<number> {
		try {
			const encounter: EncounterModel = await this.encounterRepo.findById(encounterId);
			return encounter.version;
		}
		catch (error) {
			throw error;
		}
	}

	public async incrementVersion(encounterId: string): Promise<void> {
		try {
			const encounter: EncounterModel = await this.encounterRepo.findById(encounterId);
			await encounter.incrementVersion();
			return;
		}
		catch (error) {
			throw error;
		}
	}

	public async setLightSources(encounterId: string, lightSources: LightSourceData[]): Promise<EncounterModel> {
		try {
			const encounter: EncounterModel = await this.encounterRepo.findById(encounterId);
			const lights: LightSourceData[] = lightSources;
			for (let light of lights) {
				delete light.dim_polygon;
				delete light.bright_polygon;
			}
			return await encounter.setLightSources(lights);
		}
		catch (error) {
			throw error;
		}
	}

	public async addNotation(encounterId: string, userId: string): Promise<NotationData> {
		try {
			const encounter: EncounterModel = await this.encounterRepo.findById(encounterId);
			const notation: NotationModel = await this.notationRepo.create(encounterId, userId);
			await encounter.addNotation(notation);
			await MqServiceSingleton.sendEncounterCommand(encounterId, userId, EncounterCommandType.ADD_NOTATION, encounter.version + 1, notation);

			return notation;
		}
		catch (error) {
			throw error;
		}
	}

	public async removeNotation(notationId: string, userId: string): Promise<void> {
		try {
			const notation: NotationModel = await this.notationRepo.findById(notationId);
			const encounter: EncounterModel = await this.encounterRepo.findById(notation.encounterId);
			await encounter.removeNotation(notationId);
			await this.notationRepo.deleteById(notationId);
			await MqServiceSingleton.sendEncounterCommand(notation.encounterId, userId, EncounterCommandType.REMOVE_NOTATION, encounter.version + 1, notationId);

			return;
		}
		catch (error) {
			throw error;
		}
	}

	public async setWallData(encounterId: string, wallData: any): Promise<EncounterModel> {
		try {
			const encounter: EncounterModel = await this.encounterRepo.findById(encounterId);
			return await encounter.setWallData(wallData);
		}
		catch (error) {
			throw error;
		}
	}

	public async setDoorData(encounterId: string, doorData: any): Promise<EncounterModel> {
		try {
			const encounter: EncounterModel = await this.encounterRepo.findById(encounterId);
			return await encounter.setDoorData(doorData);
		}
		catch (error) {
			throw error;
		}
	}

	public async setWindowData(encounterId: string, windowData: any): Promise<EncounterModel> {
		try {
			const encounter: EncounterModel = await this.encounterRepo.findById(encounterId);
			return await encounter.setWindowData(windowData);
		}
		catch (error) {
			throw error;
		}
	}

	public async setEncounterConfig(encounterId: string, encounterConfig: EncounterConfigData): Promise<EncounterModel> {
		try {
			const encounter: EncounterModel = await this.encounterRepo.findById(encounterId);
			return encounter.setConfig(encounterConfig);
		}
		catch (error) {
			throw error;
		}
	}

	public async setEncounterTeamsData(encounterId: string, teamsData: EncounterTeamsData): Promise<EncounterModel> {
		try {
			const encounter: EncounterModel = await this.encounterRepo.findById(encounterId);
			return encounter.setTeamsData(teamsData);
		}
		catch (error) {
			throw error;
		}
	}

	public async getExportJson(encounterId: string): Promise<any> {
		const encounterJson = await this.buildEncounterState(await this.encounterRepo.findById(encounterId));
		delete encounterJson._id;
		delete encounterJson.version;
		delete encounterJson.date;
		delete encounterJson.campaignId;
		delete encounterJson.gameMasters;
		delete encounterJson.players;
		delete encounterJson.playerIds;
		delete encounterJson.notationIds;
		delete encounterJson.teamsData.users;
		encounterJson.isOpen = false;
		return encounterJson;
	}

	public async createNewFromJson(userId: string, campaignId: string, data: EncounterData): Promise<EncounterModel> {
		let encounterModel: EncounterModel = await this.create(userId, data.label, campaignId, data.mapDimX, data.mapDimY, data.mapUrl);
		encounterModel = await this.setEncounterConfig(encounterModel._id, data.config);
		encounterModel = await this.setWallData(encounterModel._id, data.wallData);
		encounterModel = await this.setDoorData(encounterModel._id, data.doorData);
		encounterModel = await this.setLightSources(encounterModel._id, data.lightSources);
		encounterModel = await this.setWindowData(encounterModel._id, data.windowData);
		encounterModel = await this.setEncounterTeamsData(encounterModel._id, data.teamsData);
		return encounterModel;
	}

	private async getPlayerPlacementMap(encounterModel: EncounterModel): Promise<boolean[][]> {
		const encounterState = await this.buildEncounterState(encounterModel);
		const placementMap: boolean[][] = [];
		for (let i = 0; i < encounterState.mapDimX; i++) {
			let nestedArray: boolean[] = [];
			for (let j = 0; j < encounterState.mapDimY; j++) {
				nestedArray.push(false);
			}
			placementMap.push(nestedArray);
		}
		if (encounterState.players) {
			for (let player of encounterState.players) {
				placementMap[player.location.x][player.location.y] = true;
			}
		}

		return placementMap;
	}

	private async buildEncounterState(encounterModel: EncounterModel): Promise<EncounterData> {
		let encounterState: EncounterData = JSON.parse(JSON.stringify(encounterModel));
		encounterState.players = [];
		encounterState.gameMasters = [];
		encounterState.notations = [];
		for (let playerId of encounterModel.playerIds) {
			const playerData = await this.playerRepo.findById(playerId);
			playerData.characterData.characterSheet = await this.characterSheetRepo.findById(playerData.characterData.characterSheetId);
			encounterState.players.push(playerData);
		}
		for (let notationId of encounterModel.notationIds) {
			const notation = await this.notationRepo.findById(notationId);
			encounterState.notations.push(notation);
		}
		let userCampaigns: UserCampaignModel[] = await this.userCampaignRepo.findAllForCampaign(encounterModel.campaignId);
		for (let userCampaign of userCampaigns) {
			if (userCampaign.gameMaster) {
				encounterState.gameMasters.push(userCampaign.userId);
			}
		}
		delete encounterState['playerIds'];
		delete encounterState['notationIds'];

		return encounterState;
	}

	private async isGameMaster(userId: string, encounter: EncounterModel): Promise<boolean> {
		const userCampaign: UserCampaignModel = await this.userCampaignRepo.find(userId, encounter.campaignId);
		return userCampaign.gameMaster;
	}
}