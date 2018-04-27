import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { NotificationModel } from "../models/notification.model";
import { NotificationType } from "../../../../shared/types/notification-type";
import { CampaignRepository } from './campaign.repository';
import { CampaignModel } from '../models/campaign.model';

export class NotificationRepository {
    private Notification: mongoose.Model<mongoose.Document>;

    private campaignRepo: CampaignRepository;

    constructor() {
        this.Notification = mongoose.model('Notification');
        this.campaignRepo = new CampaignRepository();
    }

    public createCampaignInvite(toUserId: string, campaignId: string): Promise<NotificationModel> {
        return new Promise((resolve, reject) => {
            this.campaignRepo.findById(campaignId).then((campaign: CampaignModel) => {
                this.Notification.create({
                    toUserId: toUserId,
                    notificationType: NotificationType.CAMPAIGN_INVITE,
                    notificationData: {
                        notificationType: NotificationType.CAMPAIGN_INVITE,
                        campaignId: campaignId,
                        campaignLabel: campaign.label
                    }
                }, (error, notification: NotificationModel) => {
                    if (error) {
                        reject (error);
                        return;
                    }

                    resolve(notification);
                });
            });

        });
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
