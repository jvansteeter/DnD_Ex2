import { NotificationData } from "../../../shared/types/notification-data";

export class LoggedInUserSocketService {
    private userSocketMap = {};

    public addUser(userId: string, socket): void {
        this.userSocketMap[userId] = socket;
    }

    public removeUser(userId: string): void {
        delete this.userSocketMap[userId];
    }

    emitToUser(userId: string, notificationData: NotificationData): void {
        if (this.userSocketMap.hasOwnProperty(userId)) {
            this.userSocketMap[userId].emit(notificationData.notificationType, notificationData);
        }
    }
}

module.exports = new LoggedInUserSocketService();