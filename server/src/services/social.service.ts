import { Promise } from 'bluebird';
import { UserRepository } from '../db/repositories/user.repository';
import { FriendRepository } from '../db/repositories/friend.repository';
import { FriendRequestRepository } from '../db/repositories/friendRequest.repository';

export class SocialService {
    private userRepository: UserRepository;
    private friendRepository: FriendRepository;
    private friendRequestRepository: FriendRequestRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.friendRepository = new FriendRepository();
        this.friendRequestRepository = new FriendRequestRepository();
    }

    public sendFriendRequest(fromUserId: string, toUserId: string): Promise<void> {

    }
}