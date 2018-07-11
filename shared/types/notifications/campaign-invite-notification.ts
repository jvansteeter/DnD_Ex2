import { NotificationBody } from './notification-body';

export interface CampaignInviteNotification extends NotificationBody {
	campaignId: string;
}