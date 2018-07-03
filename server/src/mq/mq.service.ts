import { MqProxy, MqProxySingleton } from './mqProxy';
import { UserModel } from '../db/models/user.model';
import { EncounterUpdateMessage } from './encounter-update.message';
import { FriendRequest } from '../../../shared/types/mq/FriendRequest';
import { NotificationRepository } from '../db/repositories/notification.repository';
import { NotificationType } from '../../../shared/types/notifications/notification-type.enum';
import { FriendRequestNotification } from '../../../shared/types/notifications/FriendRequestNotification';
import { NotificationModel } from '../db/models/notification.model';

export class MqService {
	private notificationRepo: NotificationRepository;

	constructor(private mqProxy: MqProxy) {
		this.notificationRepo = new NotificationRepository();
	}

	public handleMessages(): void {
		this.mqProxy.observeAllEncounters().subscribe((message: EncounterUpdateMessage) => {
			console.log(message)
		});
		this.mqProxy.observeAllFriendRequests().subscribe(async (friendRequest: FriendRequest) => {
			await this.handleFriendRequest(friendRequest);
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
}

export const MqServiceSingleton: MqService = new MqService(MqProxySingleton);