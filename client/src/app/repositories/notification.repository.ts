import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/operators';
import { NotificationData } from '../../../../shared/types/notifications/notification-data';

@Injectable()
export class NotificationRepository {
	constructor(private http: HttpClient) {

	}

	public getPendingNotifications(): Observable<NotificationData[]> {
		return this.http.get<NotificationData[]>('api/notification/pending', {responseType: 'json'});
	}

	public deleteNotification(notificationId: string): Observable<void> {
		return this.http.post('api/notification/delete', {notificationId: notificationId}, {responseType: 'text'}).pipe(map(() => {return;}));
	}
}