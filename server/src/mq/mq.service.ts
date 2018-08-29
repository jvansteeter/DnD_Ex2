import { MqProxy, MqProxySingleton } from './mqProxy';
import { UserModel } from '../db/models/user.model';
import { FriendRequest } from '../../../shared/types/mq/FriendRequest';
import { NotificationRepository } from '../db/repositories/notification.repository';
import { NotificationType } from '../../../shared/types/notifications/notification-type.enum';
import { NotificationModel } from '../db/models/notification.model';
import { CampaignInvite } from '../../../shared/types/mq/campaign-invite';
import { CampaignInviteNotification } from '../../../shared/types/notifications/campaign-invite-notification';
import { FriendRequestNotification } from "../../../shared/types/notifications/friend-request-notification";
import { FriendRepository } from "../db/repositories/friend.repository";
import { EncounterCommandType } from '../../../shared/types/encounter/encounter-command.enum';
import { PlayerRepository } from '../db/repositories/player.repository';
import { PlayerData } from '../../../shared/types/encounter/player.data';
import { MqMessageType } from '../../../shared/types/mq/message-type.enum';
import { EncounterCommandMessage } from './messages/encounter-command.message';
import { EncounterService } from '../services/encounter.service';

export class MqService {
	private friendRepo: FriendRepository;
	private notificationRepo: NotificationRepository;
	private playerRepository: PlayerRepository;
	private encounterService: EncounterService;

	constructor(private mqProxy: MqProxy) {
		this.friendRepo = new FriendRepository();
		this.notificationRepo = new NotificationRepository();
		this.playerRepository = new PlayerRepository();
		this.encounterService = new EncounterService();
	}

	public handleMessages(): void {
		this.mqProxy.observeAllEncounters().subscribe((message: EncounterCommandMessage) => {
			this.handleEncounterCommand(message);
		});
		this.mqProxy.observeAllFriendRequests().subscribe( (friendRequest: FriendRequest) => {
			this.handleFriendRequest(friendRequest);
		});
		this.mqProxy.observeAllCampaignInvites().subscribe((campaignInvite: CampaignInvite) => {
			this.handleCampaignInvite(campaignInvite);
		});
	}

	public createMqAccount(user: UserModel): Promise<void> {
		return this.mqProxy.createMqAccount(user);
	}

	public userHasMqAccount(user: UserModel): Promise<boolean> {
		return this.mqProxy.userHasMqAccount(user);
	}

	public async sendEncounterCommand(encounterId: string, userId: string, commandType: EncounterCommandType, version: number, data: any): Promise<void> {
		try {
			await this.mqProxy.sendEncounterCommand(encounterId, {
				headers: {
					type: MqMessageType.ENCOUNTER,
					encounterId: encounterId
				},
				body: {
					userId: userId,
					version: version,
					dataType: commandType,
					data: data
				}
			});
		}
		catch (error) {
			throw error;
		}
	}

	private async handleEncounterCommand(command: EncounterCommandMessage): Promise<void> {
		try {
			const version = await this.encounterService.getVersion(command.headers.encounterId);
			if (command.body.version === version + 1) {
				switch (command.body.dataType) {
					case EncounterCommandType.PLAYER_UPDATE: {
						await this.playerRepository.updatePlayer(command.body.data as PlayerData);
						break;
					}
					case EncounterCommandType.ADD_PLAYER: {
						// do nothing, the server issues these ones
						break;
					}
					case EncounterCommandType.REMOVE_PLAYER: {
						// do nothing, the server issues these commands
						break;
					}
					default: {
						console.error('Unrecognized Command Type')
					}
				}
				await this.encounterService.incrementVersion(command.headers.encounterId);
			}
		}
		catch (error) {
			console.error(error);
		}
	}

	private async handleFriendRequest(friendRequest: FriendRequest): Promise<void> {
		let toUserId = friendRequest.headers.toUserId;
		let fromUserId = friendRequest.headers.fromUserId;
		try {
			let pendingRequests: NotificationModel[] = await this.notificationRepo.findAllToByType(toUserId, NotificationType.FRIEND_REQUEST);
			for (let request of pendingRequests) {
				if ((request.body as FriendRequestNotification).fromUserId && (request.body as FriendRequestNotification).fromUserId === fromUserId) {
					return;
				}
			}
			let usersAreFriends: boolean = await this.friendRepo.usersAreFriends(toUserId, fromUserId);
			if (usersAreFriends) {
				return;
			}
			await this.notificationRepo.create(toUserId, NotificationType.FRIEND_REQUEST, {
				type: NotificationType.FRIEND_REQUEST,
				toUserId: toUserId,
				fromUserId: fromUserId,
			} as FriendRequestNotification);
		}
		catch (error) {
			console.error(error);
		}
	}

	private async handleCampaignInvite(campaignInvite: CampaignInvite): Promise<void> {
		let campaignId = campaignInvite.headers.campaignId;
		let toUserId = campaignInvite.headers.toUserId;
		try {
			let pendingNotifications: NotificationModel[] = await this.notificationRepo.findAllToByType(toUserId, NotificationType.CAMPAIGN_INVITE);
			for (let invite of pendingNotifications) {
				let campaignInvite: CampaignInviteNotification = invite.body as CampaignInviteNotification;
				if (campaignInvite.campaignId && campaignInvite.campaignId === campaignId) {
					return;
				}
			}
			await this.notificationRepo.create(toUserId, NotificationType.CAMPAIGN_INVITE, {
				type: NotificationType.CAMPAIGN_INVITE,
				campaignId: campaignId
			} as CampaignInviteNotification);
			return;
		}
		catch (error) {
			console.error(error);
		}
	}
}

export const MqServiceSingleton: MqService = new MqService(MqProxySingleton);