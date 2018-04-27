import { Injectable } from '@angular/core';
import { UserProfile } from '../../types/userProfile';
import { SocialService } from '../../social/social.service';
import { NotificationData } from "../../../../../shared/types/notification-data";

@Injectable()
export class NotificationsService {
    public notifications: NotificationData[];
    public friendRequests: UserProfile[];

    constructor(private socialService: SocialService) {
        this.notifications = [];
        this.friendRequests = [];
        this.getPendingFriendRequests();
        this.getPendingNotifications();
    }

    public getPendingFriendRequests(): void {
        this.socialService.getPendingFriendRequests().subscribe((fromUsers: UserProfile[]) => {
            this.friendRequests = fromUsers;
        });
    }

    public getPendingNotifications(): void {
        this.socialService.getPendingNotifications().subscribe((notifications: NotificationData[]) => {
            this.notifications = notifications;
        });
    }

    public removeFriendRequest(fromUserId: string): void {
        for (let i = 0; i < this.friendRequests.length; i++) {
            if (this.friendRequests[i]._id === fromUserId) {
                this.friendRequests.splice(i, 1);
                return;
            }
        }
    }
}