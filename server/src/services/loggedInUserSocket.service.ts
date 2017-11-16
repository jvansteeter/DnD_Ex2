export class LoggedInUserSocketService {
    private userSocketMap = {};

    public addUser(userId: string, socket): void {
        this.userSocketMap[userId] = socket;
    }

    public removeUser(userId: string): void {
        delete this.userSocketMap[userId];
    }

    emitToUser(userId: string, eventName: string, data?: any): void {
        if (this.userSocketMap.hasOwnProperty(userId)) {
            this.userSocketMap[userId].emit(eventName, data);
        }
    }
}

module.exports = new LoggedInUserSocketService();