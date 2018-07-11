import { Injectable } from '@angular/core';
import { IsReadyService } from '../utilities/services/isReady.service';
import { FriendService } from './friend.service';
import { MqService } from '../mq/mq.service';
import { filter } from 'rxjs/operators';
import { StompMessage } from '../mq/messages/stomp-message';
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationData } from '../../../../shared/types/notifications/notification-data';

@Injectable()
export class NotificationService extends IsReadyService {
	public notifications: NotificationData[];

	constructor(private friendService: FriendService,
	            private notificationRepo: NotificationRepository,
	            private mqService: MqService) {
		super(friendService, mqService);
		this.notifications = [];
		this.init();
	}

	public init(): void {
		this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady) {
				this.getPendingNotifications();
				this.observeIncomingNotifications();
				this.setReady(true);
			}
			else {
				this.setReady(false);
			}
		});
	}

	public getPendingNotifications(): void {
		this.notificationRepo.getPendingNotifications().subscribe((notifications: NotificationData[]) => {
			this.notifications = notifications;
			console.log('here are my notifications')
			console.log(this.notifications)
		});
	}

	public removeNotification(notification: NotificationData, deleteServerSide: boolean = false): void {
		for (let i = 0; i < this.notifications.length; i++) {
			if (notification._id === this.notifications[i]._id) {
				this.notifications.splice(i, 1);
				if (deleteServerSide) {
					this.notificationRepo.deleteNotification(notification._id).subscribe();
				}
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

	private observeIncomingNotifications(): void {
		this.mqService.getIncomingUserMessages().pipe(
				filter((message: StompMessage) =>
						message.headers.type === MqMessageType.CAMPAIGN_INVITE  ||
						message.headers.type === MqMessageType.FRIEND_REQUEST
				),
		).subscribe((message: StompMessage) => {
			console.log('received campaign invite message')
			console.log(message)
			this.getPendingNotifications();
		});
	}
}