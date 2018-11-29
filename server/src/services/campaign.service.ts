import { CampaignModel } from '../db/models/campaign.model';
import { CampaignRepository } from '../db/repositories/campaign.repository';
import { UserCampaignModel } from '../db/models/user-campaign.model';
import { UserCampaignRepository } from '../db/repositories/user-campaign.repository';
import { UserRepository } from '../db/repositories/user.repository';
import { UserModel } from '../db/models/user.model';
import { NotificationRepository } from '../db/repositories/notification.repository';
import { NotificationModel } from '../db/models/notification.model';
import { ServerError } from '../../../shared/errors/ServerError';
import { NotificationType } from '../../../shared/types/notifications/notification-type.enum';
import { CampaignInviteNotification } from '../../../shared/types/notifications/campaign-invite-notification';
import { CharacterModel } from '../db/models/character.model';
import { CharacterRepository } from '../db/repositories/character.repository';
import { CharacterService } from './character.service';
import { EncounterModel } from '../db/models/encounter.model';
import { EncounterRepository } from '../db/repositories/encounter.repository';
import { EncounterService } from './encounter.service';

export class CampaignService {
	private campaignRepository: CampaignRepository;
	private userRepository: UserRepository;
	private notificationRepo: NotificationRepository;
	private userCampaignRepository: UserCampaignRepository;
	private characterRepo: CharacterRepository;
	private characterService: CharacterService;
	private encounterRepo: EncounterRepository;
	private encounterService: EncounterService;

	constructor() {
		this.campaignRepository = new CampaignRepository();
		this.userRepository = new UserRepository();
		this.notificationRepo = new NotificationRepository();
		this.userCampaignRepository = new UserCampaignRepository();
		this.characterRepo = new CharacterRepository();
		this.characterService = new CharacterService();
		this.encounterRepo = new EncounterRepository();
		this.encounterService = new EncounterService();
	}

	public create(label: string, ruleSetId: string, userId: string): Promise<CampaignModel> {
		return new Promise((resolve, reject) => {
			this.campaignRepository.create(label, ruleSetId).then((campaign: CampaignModel) => {
				this.userCampaignRepository.create(userId, campaign._id, true).then(() => {
					resolve(campaign);
				}).catch(error => reject(error));
			}).catch(error => reject(error));
		});
	}

	public async delete(userId: string, campaignId: string, systemOverride: boolean = false): Promise<void> {
		const userCampaignModel: UserCampaignModel = await this.userCampaignRepository.find(userId, campaignId);
		if (!userCampaignModel.gameMaster && !systemOverride) {
			return;
		}

		await this.userCampaignRepository.deleteAllForCampaign(campaignId);
		const campaignNpcs: CharacterModel[] = await this.characterRepo.findByCampaignId(campaignId, true);
		for (let character of campaignNpcs) {
			await this.characterService.deleteCharacter(character._id);
		}
		const campaignCharacters: CharacterModel[] = await this.characterRepo.findByCampaignId(campaignId, false);
		for (let character of campaignCharacters) {
			await this.characterRepo.deleteById(character._id);
		}
		const encounters: EncounterModel[] = await this.encounterRepo.findByCampaignId(campaignId);
		for (let encounter of encounters) {
			await this.encounterService.deleteEncounter(encounter._id);
		}

		await this.campaignRepository.deleteById(campaignId);
		return;
	}

	public getCampaign(campaignId: string): Promise<CampaignModel> {
		return this.campaignRepository.findById(campaignId);
	}

	public async join(userId: string, campaignId: string): Promise<UserCampaignModel> {
		let notifications: NotificationModel[] = await this.notificationRepo.findAllToByType(userId, NotificationType.CAMPAIGN_INVITE);
		for (let notification of notifications) {
			let campaignInvite = notification.body as CampaignInviteNotification;
			if (campaignInvite.campaignId === campaignId) {
				await this.notificationRepo.removeById(notification._id);
				return await this.userCampaignRepository.create(userId, campaignId, false);
			}
		}

		throw new Error(ServerError.NOT_INVITED);
	}

	public findAllForUser(userId: string): Promise<CampaignModel[]> {
		return new Promise((resolve, reject) => {
			this.userCampaignRepository.findAllForUser(userId).then((userCampaigns: UserCampaignModel[]) => {
				let userCampaignCount = userCampaigns.length;
				if (userCampaignCount === 0) {
					resolve([]);
					return;
				}

				let campaigns: CampaignModel[] = [];
				userCampaigns.forEach((userCampaign: UserCampaignModel) => {
					this.campaignRepository.findById(userCampaign.campaignId).then((campaign: CampaignModel) => {
						campaigns.push(campaign);

						if (--userCampaignCount === 0) {
							resolve(campaigns);
						}
					}).catch(error => reject(error));
				});
			}, error => reject(error));
		});
	}

	public async findAllForCampaign(campaignId: string): Promise<any> {
		const userCampaigns: UserCampaignModel[] = await this.userCampaignRepository.findAllForCampaign(campaignId);
		let members: any[] = [];
		for (let userCampaign of userCampaigns) {
			const user: UserModel = await this.userRepository.findById(userCampaign.userId);
			const userData = JSON.parse(JSON.stringify(user));
			delete userData.passwordHash;
			userData['gameMaster'] = userCampaign.gameMaster;
			members.push(userData);
		}

		return members;
	}

	public async setIsGameMaster(campaignId: string, userId: string, isGameMaster: boolean): Promise<void> {
		const userCampaigns: UserCampaignModel[] = await this.userCampaignRepository.findAllForCampaign(campaignId);
		for (let userCampaign of userCampaigns) {
			if (userCampaign.userId === userId) {
				await userCampaign.setIsGameMaster(isGameMaster);
				break;
			}
		}
		return;
	}
}