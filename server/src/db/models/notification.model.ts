import * as mongoose from 'mongoose';
import { MongooseModel } from './mongoose.model';
import { NotificationType } from '../../../../shared/types/notifications/notification-type.enum';
import { NotificationData } from '../../../../shared/types/notifications/notification-data';

export class NotificationModel extends MongooseModel {
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
        this.notificationType = this.methods.type;
        this.notificationData = this.methods.notificationData;
    }
}

mongoose.model('Notification', new NotificationModel());