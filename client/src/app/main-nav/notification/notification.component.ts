import { Component } from "@angular/core";
import { NotificationType } from '../../../../../shared/types/notifications/notification-type.enum';
import { NotificationData } from '../../../../../shared/types/notifications/notification-data';
import { CampaignInviteNotification } from '../../../../../shared/types/notifications/campaign-invite-notification';
import { NotificationService } from '../../data-services/notification.service';

@Component({
    selector: 'app-notifications',
    templateUrl: 'notification.component.html',
    styleUrls: ['notification.component.scss']
})
export class NotificationComponent {
    public notificationType = NotificationType;

    constructor(public notificationService: NotificationService) {
    }

    public acceptCampaignInvite(notificationData: NotificationData): void {
        this.notificationService.notifications.splice(this.notificationService.notifications.indexOf(notificationData), 1);
        let campaignData = notificationData as CampaignInviteNotification;
        this.notificationService.joinCampaign(campaignData.campaignId);
    }

    public rejectCampaignInvite(notificationData: NotificationData): void {
        let campaignData = notificationData as CampaignInviteNotification;
    }
}