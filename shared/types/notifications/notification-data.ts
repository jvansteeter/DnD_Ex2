import { NotificationType } from './notification-type.enum';
import { NotificationBody } from './notification-body';

export interface NotificationData {
	_id: string;
	userId: string;
	type: NotificationType;
	body: NotificationBody;
}