import { Component } from "@angular/core";
import { UserProfile } from "../types/userProfile";
import { SocialService } from "../social/social.service";
import { NotificationsService } from "../utilities/services/notifications.service";
import { UserProfileService } from "../utilities/services/userProfile.service";

@Component({
    selector: 'app-notifications',
    templateUrl: 'notification.component.html',
    styleUrls: ['navbar.component.css']
})
export class NotificationComponent {

    constructor(private socialService: SocialService,
                public notificationsService: NotificationsService,
                private profileService: UserProfileService) {

    }

    public acceptRequest(requester: UserProfile): void {
        this.socialService.acceptRequest(requester._id);
        this.notificationsService.removeFriendRequest(requester._id);
        this.profileService.getFriends();
    }

    public rejectRequest(requester: UserProfile): void {
        this.socialService.rejectFriendRequest(requester._id);
        this.notificationsService.removeFriendRequest(requester._id);
    }
}