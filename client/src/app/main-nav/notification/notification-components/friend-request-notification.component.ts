import { Component, Input, OnInit } from '@angular/core';
import { UserProfile } from '../../../types/userProfile';
import { FriendRequestNotification } from '../../../../../../shared/types/notifications/friend-request-notification';
import { SocialRepository } from '../../../social/social.repository';
import { NotificationService } from '../../../data-services/notification.service';
import { FriendService } from '../../../data-services/friend.service';

@Component({
	selector: 'friend-request-notification',
	templateUrl: 'friend-request-notification.component.html',
	styleUrls: ['../notification.component.scss']
})
export class FriendRequestNotificationComponent implements OnInit {
	@Input('friendRequest')
	request: FriendRequestNotification;
	requestingUser: UserProfile;

	constructor(private socialRepo: SocialRepository,
	            private notificationService: NotificationService,
	            private friendService: FriendService) {

	}

	public ngOnInit(): void {
		this.socialRepo.getUserById(this.request.fromUserId).subscribe((user: UserProfile) => {
			this.requestingUser = user;
		});
	}

	public acceptFriendRequest(requester: UserProfile): void {
		this.friendService.acceptRequest(requester._id);
		this.notificationService.removeFriendRequest(requester._id);
	}

	public rejectFriendRequest(requester: UserProfile): void {
		this.friendService.rejectFriendRequest(requester._id);
		this.notificationService.removeFriendRequest(requester._id);
	}
}