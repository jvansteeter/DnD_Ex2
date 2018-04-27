import { NotificationData } from "./notification-data";

export interface CampaignInviteNotification extends NotificationData {
    campaignId: string;
    campaignLabel: string;
}