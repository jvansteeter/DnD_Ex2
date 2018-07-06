import { Promise } from 'bluebird';
import { UserRepository } from '../db/repositories/user.repository';
import { FriendRepository } from '../db/repositories/friend.repository';
import { NotificationRepository } from "../db/repositories/notification.repository";
import { NotificationModel } from "../db/models/notification.model";
import { NotificationData } from '../../../shared/types/notifications/notification-data';

export class NotificationService {
	private userRepo: UserRepository;
	private friendRepo: FriendRepository;
	private notificationRepo: NotificationRepository;

	constructor() {
		this.userRepo = new UserRepository();
		this.friendRepo = new FriendRepository();
		this.notificationRepo = new NotificationRepository();
	}

	public async getPendingNotifications(toUserId: string): Promise<NotificationData[]> {
		try {
			let notifications: NotificationModel[] = await this.notificationRepo.findAllTo(toUserId);
			let notificationData: NotificationData[] = [];
			for (let notification of notifications) {
				notificationData.push(notification.notificationData);
			}

			return notificationData;
		}
		catch (error) {
			throw error;
		}
	}
}