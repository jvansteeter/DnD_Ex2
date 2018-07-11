import { Component, Input, OnInit } from '@angular/core';
import { CampaignRepository } from '../../../repositories/campaign.repository';
import { Campaign } from '../../../../../../shared/types/campaign';
import { NotificationData } from '../../../../../../shared/types/notifications/notification-data';
import { CampaignInviteNotification } from '../../../../../../shared/types/notifications/campaign-invite-notification';

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

	constructor(private campaignRepo: CampaignRepository) {

	}

	ngOnInit(): void {
		this.campaignInvite = this.notification.body as CampaignInviteNotification;
		this.campaignRepo.getCampaign(this.campaignInvite.campaignId).subscribe((campaign: Campaign) => {
			this.campaign = campaign;
			console.log(campaign)
		});
	}

	acceptInvite(): void {

	}

	rejectInvite(): void {

	}
}