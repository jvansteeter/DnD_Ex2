import { Promise } from 'bluebird';
import { UserRepository } from '../db/repositories/user.repository';
import { FriendRepository } from '../db/repositories/friend.repository';
import { FriendRequestRepository } from '../db/repositories/friendRequest.repository';
import { LoggedInUserSocketService } from './loggedInUserSocket.service';
import { FriendRequestModel } from "../db/models/friendRequest.model";
import { UserModel } from "../db/models/user.model";
import { FriendModel } from '../db/models/friend.model';
import { NotificationRepository } from "../db/repositories/notification.repository";
import { NotificationModel } from "../db/models/notification.model";
import { NotificationType } from "../../../shared/types/notification-type";
import { FriendRequest } from "../../../shared/types/friend-request";
import { NotificationData } from "../../../shared/types/notification-data";

export class SocialService {
    private userRepo: UserRepository;
    private friendRepo: FriendRepository;
    private friendRequestRepo: FriendRequestRepository;
    private notificationRepo: NotificationRepository;
    private loggedInUserService: LoggedInUserSocketService;

    constructor() {
        this.userRepo = new UserRepository();
        this.friendRepo = new FriendRepository();
        this.friendRequestRepo = new FriendRequestRepository();
        this.notificationRepo = new NotificationRepository();
        this.loggedInUserService = require('./loggedInUserSocket.service');
    }

    public sendFriendRequest(fromUserId: string, toUserId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.friendRequestRepo.create(fromUserId, toUserId).then(() => {
                this.loggedInUserService.emitToUser(toUserId, { fromUserId: fromUserId, notificationType: NotificationType.FRIEND_REQUEST } as FriendRequest);
                resolve();
            }).catch(error => reject(error));
        });
    }

    public getPendingFriendRequests(toUserId: string): Promise<FriendRequestModel[]> {
        return new Promise((resolve, reject) => {
            this.friendRequestRepo.findAllTo(toUserId).then((requests: FriendRequestModel[]) => {
                let count = requests.length;
                if (count === 0) {
                    resolve([]);
                    return;
                }

                let requestsFromUsers: UserModel[] = [];
                requests.forEach((request: FriendRequestModel) => {
                    this.userRepo.findById(request.fromUserId).then((fromUser: UserModel) => {
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

    public getPendingNotifications(toUserId: string): Promise<NotificationData[]> {
        return new Promise((resolve, reject) => {
            this.notificationRepo.findAllTo(toUserId).then((notifications: NotificationModel[]) => {
                let count = notifications.length;
                if (count === 0) {
                    resolve([]);
                    return;
                }

                let notificationsData: NotificationData[] = [];
                notifications.forEach((notification: NotificationModel) => {
                    notificationsData.push(notification.notificationData);
                    if (--count === 0) {
                        resolve(notificationsData);
                    }
                });
            }).catch(error => reject(error));
        });
    }

    public acceptFriendRequest(toUserId, fromUserId): Promise<void> {
        return new Promise((resolve, reject) => {
            this.friendRepo.create(toUserId, fromUserId).then(() => {
                this.friendRepo.create(fromUserId, toUserId).then(() => {
                    this.friendRequestRepo.findFromTo(fromUserId, toUserId).then((request: FriendRequestModel) => {
                        this.friendRequestRepo.remove(request).then(() => {
                            resolve();
                        });
                    }).catch(error => reject(error));
                }).catch(error => reject(error));
            }).catch(error => reject(error));
        });
    }

    public rejectFriendRequest(toUserId, fromUserId): Promise<void> {
        return new Promise((resolve, reject) => {
            this.friendRequestRepo.findFromTo(fromUserId, toUserId).then((request: FriendRequestModel) => {
                this.friendRequestRepo.remove(request).then(() => {
                    resolve();
                }).catch(error => reject(error));
            }).catch(error => reject(error));
        });
    }

    public getFriendList(userId: string): Promise<UserModel[]> {
        return new Promise((resolve, reject) => {
             this.friendRepo.findAll(userId).then((friends: FriendModel[]) => {
                 let friendCount = friends.length;
                 if (friendCount === 0) {
                     resolve([]);
                     return;
                 }

                 let friendList: UserModel[] = [];
                 friends.forEach((friend: FriendModel) => {
                     this.userRepo.findById(friend.friendId).then((user: UserModel) => {
                         user.passwordHash = undefined;
                         friendList.push(user);

                         if (--friendCount === 0) {
                             resolve(friendList);
                         }
                     }).catch(error => reject(error));
                 });
             }).catch(error => reject(error));
        });
    }

    public sendCampaignInvite(toUserId: string, campaignId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.notificationRepo.createCampaignInvite(toUserId, campaignId).then((notification: NotificationModel) => {
                this.loggedInUserService.emitToUser(toUserId, notification.notificationData);
                resolve();
            }).catch(error => reject(error));
        });
    }
}