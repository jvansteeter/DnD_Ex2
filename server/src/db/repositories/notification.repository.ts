import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { NotificationModel } from "../models/notification.model";
import { NotificationType } from "../../../../shared/types/notification-type";

export class NotificationRepository {
    private Notification: mongoose.Model<mongoose.Document>;

    constructor() {
        this.Notification = mongoose.model('Notification');
    }

    public createCampaignInvite(toUserId: string, campaignId: string): Promise<NotificationModel> {
        return new Promise((resolve, reject) => {
            this.Notification.create({
                toUserId: toUserId,
                notificationData: {
                    notificationType: NotificationType.CAMPAIGN_INVITE,
                    campaignId: campaignId
                }
            }, (error, notification: NotificationModel) => {
                if (error) {
                    reject (error);
                    return;
                }

                resolve(notification);
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
}
