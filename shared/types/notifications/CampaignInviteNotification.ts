import { NotificationData } from './NotificationData';

export interface CampaignInviteNotification extends NotificationData {
	campaignId: string;
	campaignLabel: string;
}