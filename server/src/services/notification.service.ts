import { Promise } from 'bluebird';
import { UserRepository } from '../db/repositories/user.repository';
import { FriendRepository } from '../db/repositories/friend.repository';
import { NotificationRepository } from "../db/repositories/notification.repository";
import { NotificationModel } from '../db/models/notification.model';
import { NotificationType } from '../../../shared/types/notifications/notification-type.enum';
import { CampaignInviteNotification } from '../../../shared/types/notifications/campaign-invite-notification';
import { UserCampaignRepository } from '../db/repositories/user-campaign.repository';
import { UserCampaignModel } from '../db/models/user-campaign.model';
import { isUndefined } from 'util';

export class NotificationService {
	private userRepo: UserRepository;
	private friendRepo: FriendRepository;
	private notificationRepo: NotificationRepository;
	private userCampaignRepo: UserCampaignRepository;

	constructor() {
		this.userRepo = new UserRepository();
		this.friendRepo = new FriendRepository();
		this.notificationRepo = new NotificationRepository();
		this.userCampaignRepo = new UserCampaignRepository();
	}

	public async getPendingNotifications(toUserId: string): Promise<NotificationModel[]> {
		try {
			return await this.notificationRepo.findAllTo(toUserId);
		}
		catch (error) {
			throw error;
		}
	}

	public async delete(notificationId: string): Promise<void> {
		try {
			return await this.notificationRepo.removeById(notificationId);
		}
		catch (error) {
			throw error;
		}
	}

	public async sendCampaignInvite(fromUserId: string, toUserId: string, campaignId: string): Promise<void> {
		try {
			const userCampaigns: UserCampaignModel[] = await this.userCampaignRepo.findAllForCampaign(campaignId);
			const fromUserCampaign = userCampaigns.find((userCampaign: UserCampaignModel) => userCampaign.userId == fromUserId);
			if (isUndefined(fromUserCampaign)) {
				return;
			}
			let pendingNotifications: NotificationModel[] = await this.notificationRepo.findAllToByType(toUserId, NotificationType.CAMPAIGN_INVITE);
			for (let invite of pendingNotifications) {
				let campaignInvite: CampaignInviteNotification = invite.body as CampaignInviteNotification;
				if (campaignInvite.campaignId && campaignInvite.campaignId === campaignId) {
					return;
				}
			}
			await this.notificationRepo.create(toUserId, NotificationType.CAMPAIGN_INVITE, {
				type: NotificationType.CAMPAIGN_INVITE,
				campaignId: campaignId
			} as CampaignInviteNotification);
			return;
		} catch (error) {
			console.error(error);
		}
	}
}