import { MqProxy, MqProxySingleton } from './mqProxy';
import { UserModel } from '../db/models/user.model';
import { EncounterUpdateMessage } from './messages/encounter-update.message';
import { FriendRequest } from '../../../shared/types/mq/FriendRequest';
import { NotificationRepository } from '../db/repositories/notification.repository';
import { NotificationType } from '../../../shared/types/notifications/notification-type.enum';
import { NotificationModel } from '../db/models/notification.model';
import { CampaignInvite } from '../../../shared/types/mq/campaign-invite';
import { CampaignInviteNotification } from '../../../shared/types/notifications/campaign-invite-notification';
import { FriendRequestNotification } from "../../../shared/types/notifications/friend-request-notification";
import { FriendRepository } from "../db/repositories/friend.repository";
import { EncounterCommand } from '../../../shared/types/encounter/encounter-command.enum';
import { PlayerRepository } from '../db/repositories/player.repository';
import { PlayerData } from '../../../shared/types/encounter/player';

export class MqService {
	private friendRepo: FriendRepository;
	private notificationRepo: NotificationRepository;
	private playerRepository: PlayerRepository;

	constructor(private mqProxy: MqProxy) {
		this.friendRepo = new FriendRepository();
		this.notificationRepo = new NotificationRepository();
		this.playerRepository = new PlayerRepository();
	}

	public handleMessages(): void {
		this.mqProxy.observeAllEncounters().subscribe((message: EncounterUpdateMessage) => {
			this.handleEncounterUpdates(message);
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

	private async handleEncounterUpdates(encounterUpdate: EncounterUpdateMessage): Promise<void> {
		switch (encounterUpdate.body.dataType) {
			case (EncounterCommand.PLAYER_UPDATE): {
				await this.playerRepository.updatePlayer(encounterUpdate.body.data as PlayerData);
				return;
			}
			default: {
				console.error('Unrecognized Command Type')
			}
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