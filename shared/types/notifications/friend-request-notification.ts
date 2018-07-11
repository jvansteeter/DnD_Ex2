import { NotificationBody } from './notification-body';

export interface FriendRequestNotification extends NotificationBody {
	toUserId: string;
	fromUserId: string;
}