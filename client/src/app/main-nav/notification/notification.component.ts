import { Component } from "@angular/core";
import { NotificationType } from '../../../../../shared/types/notifications/notification-type.enum';
import { NotificationService } from '../../data-services/notification.service';

@Component({
    selector: 'app-notifications',
    templateUrl: 'notification.component.html',
    styleUrls: ['notification.component.scss']
})
export class NotificationComponent {
    public notificationType = NotificationType;

    constructor(public notificationService: NotificationService) {
    }
}