import { NotificationData } from "./notification-data";

export interface FriendRequest extends NotificationData {
    fromUserId: string
}