import { Injectable } from '@angular/core';
import { NotificationData } from '../../../../shared/types/notification-data';
import { UserProfile } from '../types/userProfile';
import { SocialService } from '../social/social.service';
import { IsReadyService } from '../utilities/services/isReady.service';

@Injectable()
export class NotificationsService extends IsReadyService {
	public notifications: NotificationData[];
	public friendRequests: UserProfile[];

	constructor(private socialService: SocialService) {
		super(socialService);
		this.notifications = [];
		this.friendRequests = [];

	}

	public init(): void {
		this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady) {
				this.getPendingFriendRequests();
				this.getPendingNotifications();
				this.setReady(true);
			}
			else {
				this.setReady(false);
			}
		});
	}

	public getPendingFriendRequests(): void {
		this.socialService.getPendingFriendRequests().subscribe((fromUsers: UserProfile[]) => {
			this.friendRequests = fromUsers;
		});
	}

	public getPendingNotifications(): void {
		this.socialService.getPendingNotifications().subscribe((notifications: NotificationData[]) => {
			this.notifications = notifications;
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
}