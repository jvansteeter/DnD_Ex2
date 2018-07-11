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

export class MqService {
	private friendRepo: FriendRepository;
	private notificationRepo: NotificationRepository;

	constructor(private mqProxy: MqProxy) {
		this.friendRepo = new FriendRepository();
		this.notificationRepo = new NotificationRepository();
	}

	public handleMessages(): void {
		this.mqProxy.observeAllEncounters().subscribe((message: EncounterUpdateMessage) => {
			console.log(message)
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

	private async handleFriendRequest(friendRequest: FriendRequest): Promise<void> {
		let toUserId = friendRequest.headers.toUserId;
		let fromUserId = friendRequest.headers.fromUserId;
		try {
			let pendingRequests: NotificationModel[] = await this.notificationRepo.findAllToByType(toUserId, NotificationType.FRIEND_REQUEST);
			for (let request of pendingRequests) {
				if (request.notificationData['fromUserId'] && request.notificationData['fromUserId'] === fromUserId) {
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
		console.log('----- got to the handle campaign invite function -----')
		console.log(campaignInvite)
		let campaignId = campaignInvite.headers.campaignId;
		let toUserId = campaignInvite.headers.toUserId;
		try {
			let pendingNotifications: NotificationModel[] = await this.notificationRepo.findAllToByType(toUserId, NotificationType.CAMPAIGN_INVITE);
			for (let invite of pendingNotifications) {
				let campaignInvite: CampaignInviteNotification = invite.notificationData as CampaignInviteNotification;
				if (campaignInvite.campaignId && campaignInvite.campaignId === campaignId) {
					console.log('this is a duplicate so do nothing')
					return;
				}
			}
			console.log('creating campaign invite notification')
			this.notificationRepo.createCampaignInvite(toUserId, campaignId);
		}
		catch (error) {
			console.error(error);
		}
	}
}

export const MqServiceSingleton: MqService = new MqService(MqProxySingleton);