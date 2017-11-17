import { Promise } from 'bluebird';
import { UserRepository } from '../db/repositories/user.repository';
import { FriendRepository } from '../db/repositories/friend.repository';
import { FriendRequestRepository } from '../db/repositories/friendRequest.repository';
import { LoggedInUserSocketService } from './loggedInUserSocket.service';
import { FriendRequestModel } from "../db/models/friendRequest.model";
import { UserModel } from "../db/models/user.model";
import { noUndefined } from "@angular/compiler/src/util";

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

    public getPendingFriendRequests(toUserId: string): Promise<FriendRequestModel[]> {
        return new Promise((resolve, reject) => {
            this.friendRequestRepository.findAllTo(toUserId).then((requests: FriendRequestModel[]) => {
                let count = requests.length;
                if (count === 0) {
                    resolve([]);
                    return;
                }

                let requestsFromUsers: UserModel[] = [];
                requests.forEach((request: FriendRequestModel) => {
                    this.userRepository.findById(request.fromUserId).then((fromUser: UserModel) => {
                        fromUser.passwordHash = undefined;
                        requestsFromUsers.push(fromUser);
                        if (--count === 0) {
                            resolve(requestsFromUsers);
                        }
                    })
                });
            }).catch(error => reject(error));
        });
    }

    public acceptFriendRequest(toUserId, fromUserId): Promise<void> {
        return new Promise((resolve, reject) => {
            this.friendRepository.create(toUserId, fromUserId).then(() => {
                this.friendRepository.create(fromUserId, toUserId).then(() => {
                    this.friendRequestRepository.findFromTo(fromUserId, toUserId).then((request: FriendRequestModel) => {
                        request.destroy().then(() => {
                            resolve();
                        });
                    }).catch(error => reject(error));
                }).catch(error => reject(error));
            }).catch(error => reject(error));
        });
    }

    public rejectFriendRequest(toUserId, fromUserId): Promise<void> {
        return new Promise((resolve, reject) => {
            this.friendRequestRepository.findFromTo(fromUserId, toUserId).then((request: FriendRequestModel) => {
                this.friendRequestRepository.delete(request).then(() => {
                    resolve();
                }).catch(error => reject(error));
            }).catch(error => reject(error));
        });
    }
}