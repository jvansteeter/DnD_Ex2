import { Component } from "@angular/core";
import { UserProfile } from "../types/userProfile";
import { SocialService } from "../social/social.service";
import { NotificationsService } from "../data-services/notifications.service";
import { NotificationType } from '../../../../shared/types/notifications/notification-type.enum';
import { NotificationData } from '../../../../shared/types/notifications/NotificationData';
import { CampaignInviteNotification } from '../../../../shared/types/notifications/CampaignInviteNotification';

@Component({
    selector: 'app-notifications',
    templateUrl: 'notification.component.html',
    styleUrls: []
})
export class NotificationComponent {
    public notificationType = NotificationType;

    constructor(private socialService: SocialService,
                public notificationsService: NotificationsService) {

    }

    public acceptRequest(requester: UserProfile): void {
        this.socialService.acceptRequest(requester._id);
        this.notificationsService.removeFriendRequest(requester._id);
    }

    public rejectRequest(requester: UserProfile): void {
        this.socialService.rejectFriendRequest(requester._id);
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