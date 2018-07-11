import * as mongoose from 'mongoose';
import { MongooseModel } from './mongoose.model';
import { NotificationType } from '../../../../shared/types/notifications/notification-type.enum';
import { NotificationData } from '../../../../shared/types/notifications/notification-data';
import { NotificationBody } from '../../../../shared/types/notifications/notification-body';

export class NotificationModel extends MongooseModel implements NotificationData {
    public _id: string;
    public userId: string;
    public type: NotificationType;
    public body: NotificationBody;

    constructor() {
        super ({
	        userId: {type: String, required: true},
	        type: {type: String, required: true},
	        body: {type: Object, required: true}
        });

        this._id = this.methods._id;
        this.userId = this.methods.userId;
        this.type = this.methods.type;
        this.body = this.methods.body;
    }
}

mongoose.model('Notification', new NotificationModel());