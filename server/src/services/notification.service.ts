import { Promise } from 'bluebird';
import { UserRepository } from '../db/repositories/user.repository';
import { FriendRepository } from '../db/repositories/friend.repository';
import { NotificationRepository } from "../db/repositories/notification.repository";
import { NotificationModel } from '../db/models/notification.model';

export class NotificationService {
	private userRepo: UserRepository;
	private friendRepo: FriendRepository;
	private notificationRepo: NotificationRepository;

	constructor() {
		this.userRepo = new UserRepository();
		this.friendRepo = new FriendRepository();
		this.notificationRepo = new NotificationRepository();
	}

	public async getPendingNotifications(toUserId: string): Promise<NotificationModel[]> {
		try {
			return await this.notificationRepo.findAllTo(toUserId);
		}
		catch (error) {
			throw error;
		}
	}

	public async delete(notificationId: string): Promise<void> {
		try {
			return await this.notificationRepo.removeById(notificationId);
		}
		catch (error) {
			throw error;
		}
	}
}