import { Injectable } from '@angular/core';
import { Notification } from '../../types/notification';
import { UserProfile } from '../../types/userProfile';
import { SocialService } from '../../social/social.service';

@Injectable()
export class NotificationsService {
    public notifications: Notification[];
    public friendRequests: UserProfile[];

    constructor(private socialService: SocialService) {
        this.notifications = [];
        this.friendRequests = [];
    }

    public addNotification(note: Notification): void {
        this.notifications.push(note);
    }

    public getPendingFriendRequests(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socialService.getPendingFriendRequests().subscribe((fromUsers: UserProfile[]) => {
                this.friendRequests = fromUsers;
                resolve();
            }, error => {
                reject(error);
            });
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