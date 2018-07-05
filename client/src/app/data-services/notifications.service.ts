import { Injectable } from '@angular/core';
import { UserProfile } from '../types/userProfile';
import { IsReadyService } from '../utilities/services/isReady.service';
import { NotificationData } from '../../../../shared/types/notifications/NotificationData';
import { NotificationType } from '../../../../shared/types/notifications/notification-type.enum';
import { FriendRequestNotification } from '../../../../shared/types/notifications/FriendRequestNotification';
import { FriendRequestMessage } from '../mq/friend-request.message';
import { FriendService } from './friend.service';
import { SocialRepository } from '../social/social.repository';

@Injectable()
export class NotificationsService extends IsReadyService {
	public notifications: NotificationData[];
	public friendRequests: UserProfile[];

	constructor(private friendService: FriendService,
	            private socialRepo: SocialRepository) {
		super(friendService);
		this.notifications = [];
		this.friendRequests = [];
		this.init();
	}

	public init(): void {
		this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady) {
				this.getPendingNotifications();
				this.friendService.getIncomingFriendRequests().subscribe((request: FriendRequestMessage) => {
					this.handleFriendRequest(request.headers.fromUserId);
				});
				this.setReady(true);
			}
			else {
				this.setReady(false);
			}
		});
	}

	public getPendingNotifications(): void {
		this.socialRepo.getPendingNotifications().subscribe((notifications: NotificationData[]) => {
			this.notifications = notifications;
			this.notifications.forEach((notification: NotificationData) => {
				if (notification.type === NotificationType.FRIEND_REQUEST) {
					this.handleFriendRequest((notification as FriendRequestNotification).fromUserId);
				}
			});
		});
	}

	public removeFriendRequest(fromUserId: string): void {
		for (let i = 0; i < this.friendRequests.length; i++) {
			if (this.friendRequests[i]._id === fromUserId) {
				this.friendRequests.splice(i, 1);
				return;
			}
		}
	}

	public joinCampaign(campaignId: string): void {
		//     this.campaignRepo.joinCampaign(campaignId).subscribe(() => {
		//         this.campaignRepo.refreshCampaigns().subscribe((campaigns: Campaign[]) => {
		//             this.homePageService.campaigns = campaigns;
		//         });
		//     });
	}

	private handleFriendRequest(fromUserId: string): void {
		this.socialRepo.getUserById(fromUserId).subscribe((user: UserProfile) => {
			this.friendRequests.push(user);
		});
	}
}