import { Promise } from 'bluebird';
import { UserRepository } from '../db/repositories/user.repository';
import { FriendRepository } from '../db/repositories/friend.repository';
import { FriendRequestRepository } from '../db/repositories/friendRequest.repository';
import { LoggedInUserSocketService } from './loggedInUserSocket.service';

export class SocialService {
    private userRepository: UserRepository;
    private friendRepository: FriendRepository;
    private friendRequestRepository: FriendRequestRepository;
    private loggedInUserService: LoggedInUserSocketService = require('./loggedInUserSocket.service');

    constructor() {
        this.userRepository = new UserRepository();
        this.friendRepository = new FriendRepository();
        this.friendRequestRepository = new FriendRequestRepository();
    }

    public sendFriendRequest(fromUserId: string, toUserId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.friendRequestRepository.create(fromUserId, toUserId).then(() => {
                this.loggedInUserService.emitToUser(toUserId, 'friendRequest', fromUserId);
                resolve();
            }).catch(error => reject(error));
        });
    }
}