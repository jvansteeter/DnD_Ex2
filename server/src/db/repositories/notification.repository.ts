import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { NotificationModel } from "../models/notification.model";
import { CampaignRepository } from './campaign.repository';
import { CampaignModel } from '../models/campaign.model';
import { NotificationType } from '../../../../shared/types/notifications/notification-type.enum';
import { NotificationData } from '../../../../shared/types/notifications/notification-data';

export class NotificationRepository {
	private Notification: mongoose.Model<mongoose.Document>;

	private campaignRepo: CampaignRepository;

	constructor() {
		this.Notification = mongoose.model('Notification');
		this.campaignRepo = new CampaignRepository();
	}

	public async create(toUserId: string, type: NotificationType, data: NotificationData): Promise<NotificationModel> {
		try {
			return await this.Notification.create({
				toUserId: toUserId,
				notificationType: type,
				notificationData: data,
			});
		}
		catch (error) {
			throw error;
		}
	}

	public async createCampaignInvite(toUserId: string, campaignId: string): Promise<NotificationModel> {
		try {
			let campaign: CampaignModel = await this.campaignRepo.findById(campaignId);
			console.log(campaign);
			return await this.Notification.create({
				toUserId: toUserId,
				notificationType: NotificationType.CAMPAIGN_INVITE,
				notificationData: {
					notificationType: NotificationType.CAMPAIGN_INVITE,
					campaignId: campaignId,
					campaignLabel: campaign.label
				}
			});
		}
		catch (error) {
			throw error;
		}
	}

	public findAllTo(userId: string): Promise<NotificationModel[]> {
		return new Promise((resolve, reject) => {
			this.Notification.find({toUserId: userId}, (error, notifications) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(notifications);
			});
		});
	}

	public findAllToByType(userId: string, notificationType: NotificationType): Promise<NotificationModel[]> {
		return new Promise((resolve, reject) => {
			this.Notification.find({toUserId: userId, notificationType: notificationType}, (error, notifications) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(notifications);
			});
		});
	}

	public removeById(notificationId: string): Promise<void> {
		return this.Notification.remove({_id: notificationId});
	}
}
