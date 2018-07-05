import { Component } from "@angular/core";
import { UserProfile } from "../types/userProfile";
import { NotificationsService } from "../data-services/notifications.service";
import { NotificationType } from '../../../../shared/types/notifications/notification-type.enum';
import { NotificationData } from '../../../../shared/types/notifications/NotificationData';
import { CampaignInviteNotification } from '../../../../shared/types/notifications/CampaignInviteNotification';
import { FriendService } from '../data-services/friend.service';

@Component({
    selector: 'app-notifications',
    templateUrl: 'notification.component.html',
    styleUrls: ['notification.component.scss']
})
export class NotificationComponent {
    public notificationType = NotificationType;

    constructor(private friendService: FriendService,
                public notificationsService: NotificationsService) {
    }

    public acceptFriendRequest(requester: UserProfile): void {
        this.friendService.acceptRequest(requester._id);
        this.notificationsService.removeFriendRequest(requester._id);
    }

    public rejectFriendRequest(requester: UserProfile): void {
        this.friendService.rejectFriendRequest(requester._id);
        this.notificationsService.removeFriendRequest(requester._id);
    }

    public acceptCampaignInvite(notificationData: NotificationData): void {
        this.notificationsService.notifications.splice(this.notificationsService.notifications.indexOf(notificationData), 1);
        let campaignData = notificationData as CampaignInviteNotification;
        this.notificationsService.joinCampaign(campaignData.campaignId);
    }

    public rejectCampaignInvite(notificationData: NotificationData): void {
        let campaignData = notificationData as CampaignInviteNotification;
    }
}