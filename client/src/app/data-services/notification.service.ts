import { Injectable } from '@angular/core';
import { IsReadyService } from '../utilities/services/isReady.service';
import { NotificationType } from '../../../../shared/types/notifications/notification-type.enum';
import { FriendRequestMessage } from '../mq/messages/friend-request.message';
import { FriendService } from './friend.service';
import { SocialRepository } from '../social/social.repository';
import { NotificationData } from '../../../../shared/types/notifications/notification-data';
import { FriendRequestNotification } from '../../../../shared/types/notifications/friend-request-notification';
import { MqService } from '../mq/mq.service';
import { filter } from 'rxjs/operators';
import { StompMessage } from '../mq/messages/stomp-message';
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';

@Injectable()
export class NotificationService extends IsReadyService {
	public notifications: NotificationData[];

	constructor(private friendService: FriendService,
	            private socialRepo: SocialRepository,
	            private mqService: MqService) {
		super(friendService, mqService);
		this.notifications = [];
		this.init();
	}

	public init(): void {
		this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady) {
				this.getPendingNotifications();
				this.friendService.getIncomingFriendRequests().subscribe((request: FriendRequestMessage) => {
					this.handleFriendRequest({
						type: NotificationType.FRIEND_REQUEST,
						toUserId: request.headers.toUserId,
						fromUserId: request.headers.fromUserId,
					} as FriendRequestNotification);
					// this.notifications.push({
					// 	type: NotificationType.FRIEND_REQUEST,
					// 	toUserId: request.headers.toUserId,
					// 	fromUserId: request.headers.fromUserId,
					// } as FriendRequestNotification);
				});
				this.observeAllOtherNotifications();
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
			console.log('these are my notifications')
			console.log(this.notifications)
			// this.notifications.forEach((notification: NotificationData) => {
			// 	if (notification.type === NotificationType.FRIEND_REQUEST) {
			// 		this.handleFriendRequest((notification as FriendRequestNotification).fromUserId);
			// 	}
			// });
		});
	}

	public removeFriendRequest(fromUserId: string): void {
		// for (let i = 0; i < this.friendRequests.length; i++) {
		// 	if (this.friendRequests[i]._id === fromUserId) {
		// 		this.friendRequests.splice(i, 1);
		// 		return;
		// 	}
		// }
	}

	public joinCampaign(campaignId: string): void {
		//     this.campaignRepo.joinCampaign(campaignId).subscribe(() => {
		//         this.campaignRepo.refreshCampaigns().subscribe((campaigns: Campaign[]) => {
		//             this.homePageService.campaigns = campaigns;
		//         });
		//     });
	}

	private handleFriendRequest(notification: FriendRequestNotification): void {
		for (let note of this.notifications) {
			if (note.type === NotificationType.FRIEND_REQUEST) {
				let friendRequest = note as FriendRequestNotification;
				if (notification.fromUserId === friendRequest.fromUserId) {
					return;
				}
			}
		}
		this.notifications.push(notification);
	}

	private observeAllOtherNotifications(): void {
		this.mqService.getIncomingUserMessages().pipe(
				filter((message: StompMessage) => message.headers.type === MqMessageType.CAMPAIGN_INVITE),
		).subscribe((message: StompMessage) => {
			console.log('received campaign invite message')
			console.log(message)
			this.getPendingNotifications();
		});
	}
}