import { Promise } from 'bluebird';
import { FriendRepository } from '../db/repositories/friend.repository';
import { UserModel } from "../db/models/user.model";
import { FriendModel } from '../db/models/friend.model';
import { NotificationRepository } from "../db/repositories/notification.repository";
import { NotificationModel } from "../db/models/notification.model";
import { NotificationType } from '../../../shared/types/notifications/notification-type.enum';
import { FriendRequestNotification } from '../../../shared/types/notifications/friend-request-notification';
import { UserRepository } from "../db/repositories/user.repository";

export class SocialService {
	private friendRepo: FriendRepository;
	private notificationRepo: NotificationRepository;
	private userRepo: UserRepository;

	constructor() {
		this.userRepo = new UserRepository();
		this.friendRepo = new FriendRepository();
		this.notificationRepo = new NotificationRepository();
	}

	// public getPendingFriendRequests(toUserId: string): Promise<FriendRequestModel[]> {
	//     return new Promise((resolve, reject) => {
	//         this.friendRequestRepo.findAllTo(toUserId).then((requests: FriendRequestModel[]) => {
	//             let count = requests.length;
	//             if (count === 0) {
	//                 resolve([]);
	//                 return;
	//             }
	//
	//             let requestsFromUsers: UserModel[] = [];
	//             requests.forEach((request: FriendRequestModel) => {
	//                 this.userRepo.findById(request.fromUserId).then((fromUser: UserModel) => {
	//                     delete fromUser.passwordHash;
	//                     requestsFromUsers.push(fromUser);
	//                     if (--count === 0) {
	//                         resolve(requestsFromUsers);
	//                     }
	//                 })
	//             });
	//         }).catch(error => reject(error));
	//     });
	// }

	public async acceptFriendRequest(toUserId, fromUserId): Promise<void> {
		console.log('SocialService.acceptFriendRequest()')
		try {
			let friendRequests: NotificationModel[] = await this.notificationRepo.findAllToByType(toUserId, NotificationType.FRIEND_REQUEST);
			friendRequests.forEach(async (friendRequest: NotificationModel) => {
				let data: FriendRequestNotification = friendRequest.notificationData as FriendRequestNotification;
				if (data.fromUserId === fromUserId) {
					await this.friendRepo.create(toUserId, fromUserId);
					await this.friendRepo.create(fromUserId, toUserId);
					await this.notificationRepo.removeById(friendRequest._id);
					return;
				}
			});
		}
		catch (error) {
			throw error;
		}
	}

	public async rejectFriendRequest(toUserId, fromUserId): Promise<void> {
		try {
			let friendRequests: NotificationModel[] = await this.notificationRepo.findAllToByType(toUserId, NotificationType.FRIEND_REQUEST);
			friendRequests.forEach(async (friendRequest: NotificationModel) => {
				let data: FriendRequestNotification = friendRequest.notificationData as FriendRequestNotification;
				if (data.fromUserId === fromUserId) {
					await this.notificationRepo.removeById(friendRequest._id);
					return;
				}
			});
		}
		catch (error) {
			throw (error);
		}
	}

	public async createFriendRequest(toUserId, fromUserId): Promise<void> {
		try {
			let pendingRequests: NotificationModel[] = await this.notificationRepo.findAllToByType(toUserId, NotificationType.FRIEND_REQUEST);
			for (let request of pendingRequests) {
				if (request.notificationData['fromUserId'] && request.notificationData['fromUserId'] === fromUserId) {
					return;
				}
			}
			let usersAreFriends: boolean = this.friendRepo.usersAreFriends(toUserId, fromUserId);
			if (usersAreFriends) {
				return;
			}
			await this.notificationRepo.create(toUserId, NotificationType.FRIEND_REQUEST, {
				type: NotificationType.FRIEND_REQUEST,
				toUserId: toUserId,
				fromUserId: fromUserId,
			} as FriendRequestNotification);
		}
		catch (error) {
			console.error(error);
		}
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
						delete user.passwordHash;
						friendList.push(user);

						if (--friendCount === 0) {
							resolve(friendList);
						}
					}).catch(error => reject(error));
				});
			}).catch(error => reject(error));
		});
	}

	// public sendCampaignInvite(toUserId: string, campaignId: string): Promise<void> {
	// 	return new Promise((resolve, reject) => {
	// 		this.notificationRepo.createCampaignInvite(toUserId, campaignId).then((notification: NotificationModel) => {
	// 			resolve();
	// 		}).catch(error => reject(error));
	// 	});
	// }

	public async findUserById(userId: string): Promise<UserModel> {
		try {
			let user: UserModel = this.userRepo.findById(userId);
			delete user.passwordHash;
			return user;
		}
		catch (error) {
			throw error;
		}
	}
}