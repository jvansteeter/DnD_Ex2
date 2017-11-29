import { Injectable } from '@angular/core';
import { Notification } from '../../types/notification';

@Injectable()
export class NotificationsService {
    public notifications: Notification[];
    public newNotifications: boolean;

    constructor() {
        this.newNotifications = false;
    }

    public setNewNotifications(display: boolean): void {
        this.newNotifications = display;
    }

    public addNotification(note: Notification): void {
        this.notifications.push(note);
    }

    public clearNotifications(): void {
        this.notifications = [];
    }
}