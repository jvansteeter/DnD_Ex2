import { NotificationData } from './notification-data';

export interface FriendRequestNotification extends NotificationData {
	toUserId: string;
	fromUserId: string;
}