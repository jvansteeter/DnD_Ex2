import { Component, Input, OnInit } from '@angular/core';
import { UserProfile } from '../../../types/userProfile';
import { FriendRequestNotification } from '../../../../../../shared/types/notifications/friend-request-notification';
import { SocialRepository } from '../../../social/social.repository';
import { NotificationService } from '../../../data-services/notification.service';
import { FriendService } from '../../../data-services/friend.service';
import { NotificationData } from '../../../../../../shared/types/notifications/notification-data';

@Component({
	selector: 'friend-request-notification',
	templateUrl: 'friend-request-notification.component.html',
	styleUrls: ['../notification.component.scss']
})
export class FriendRequestNotificationComponent implements OnInit {
	@Input('notification')
	notification: NotificationData;
	friendRequest: FriendRequestNotification;
	requestingUser: UserProfile;

	constructor(private socialRepo: SocialRepository,
	            private notificationService: NotificationService,
	            private friendService: FriendService) {

	}

	public ngOnInit(): void {
		this.friendRequest = this.notification.body as FriendRequestNotification;
		this.socialRepo.getUserById(this.friendRequest.fromUserId).subscribe((user: UserProfile) => {
			this.requestingUser = user;
		});
	}

	public acceptFriendRequest(): void {
		this.friendService.acceptRequest(this.friendRequest.fromUserId);
		this.notificationService.removeNotification(this.notification);
	}

	public rejectFriendRequest(): void {
		this.notificationService.removeNotification(this.notification, true);
	}
}