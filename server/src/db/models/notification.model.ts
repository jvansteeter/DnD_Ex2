import * as mongoose from 'mongoose';
// import { Promise } from 'bluebird';
import { NotificationData } from "../../../../shared/types/notification-data";
import { NotificationType } from '../../../../shared/types/notification-type';


export class NotificationModel extends mongoose.Schema {
    public _id: string;
    public toUserId: string;
    public notificationType: NotificationType;
    public notificationData: NotificationData;

    constructor() {
        super ({
            toUserId: {type: String, required: true},
            notificationType: {type: String, required: true},
            notificationData: {type: Object, required: true}
        });

        this._id = this.methods._id;
        this.toUserId = this.methods.toUserId;
        this.notificationType = this.methods.notificationType;
        this.notificationData = this.methods.notificationData;
    }

    private save(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.methods.save((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    }
}

mongoose.model('Notification', new NotificationModel());