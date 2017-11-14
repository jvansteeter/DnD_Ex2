export class CurrentUsersService {
    currentUsers: string[] = [];

    public addUser(username: string): void {
        this.currentUsers.push(username);
    }
}

module.exports = new CurrentUsersService();