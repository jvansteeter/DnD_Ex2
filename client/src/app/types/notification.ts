export enum NotificationType {
    FRIEND_REQUEST
}

export interface Notification {
    type: NotificationType;
    message: string;
}