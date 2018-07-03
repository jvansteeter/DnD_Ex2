import { NotificationData } from './NotificationData';

export interface FriendRequestNotification extends NotificationData {
	toUserId: string;
	fromUserId: string;
}