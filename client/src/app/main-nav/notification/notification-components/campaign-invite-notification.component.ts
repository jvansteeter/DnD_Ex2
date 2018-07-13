import { Component, Input, OnInit } from '@angular/core';
import { Campaign } from '../../../../../../shared/types/campaign';
import { NotificationData } from '../../../../../../shared/types/notifications/notification-data';
import { CampaignInviteNotification } from '../../../../../../shared/types/notifications/campaign-invite-notification';
import { NotificationService } from '../../../data-services/notification.service';
import { CampaignService } from '../../../data-services/campaign.service';

@Component({
	selector: 'campaign-invite-notification',
	templateUrl: 'campaign-invite-notification.component.html',
	styleUrls: ['../notification.component.scss']
})
export class CampaignInviteNotificationComponent implements OnInit {
	@Input('notification')
	notification: NotificationData;
	campaignInvite: CampaignInviteNotification;
	campaign: Campaign;

	constructor(private campaignService: CampaignService,
	            private notificationService: NotificationService) {

	}

	ngOnInit(): void {
		this.campaignInvite = this.notification.body as CampaignInviteNotification;
		this.campaignService.getCampaign(this.campaignInvite.campaignId).subscribe((campaign: Campaign) => {
			this.campaign = campaign;
		});
	}

	acceptInvite(): void {
		this.notificationService.removeNotification(this.notification);
		this.campaignService.joinCampaign(this.campaignInvite.campaignId).subscribe(() => {
			this.campaignService.refreshCampaigns();
		});
	}

	rejectInvite(): void {
		this.notificationService.removeNotification(this.notification, true);
	}
}