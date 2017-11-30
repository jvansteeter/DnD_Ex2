import { UserProfileService } from '../utilities/services/userProfile.service';
import { UserProfile } from '../types/userProfile';
import { AddFriendComponent } from '../social/add-friend/add-friend.component';
import { NotificationsService } from '../utilities/services/notifications.service';
import { MatDialog } from '@angular/material';
import { Component } from '@angular/core';
import { SocialService } from '../social/social.service';

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.css']
})
export class NavbarComponent {
    private username: string;
    private navLinks: any[];

    constructor(private profileService: UserProfileService,
                public notificationsService: NotificationsService,
                private socialService: SocialService,
                private dialog: MatDialog) {
        this.navLinks = [
            {
                label: 'Home',
                route: 'home'
            },
            {
                label: 'Map Maker',
                route: 'map-maker'
            }
        ];
        this.profileService.getUserProfile().then((userProfile: UserProfile) => {
            this.username = userProfile.getName();
        });
    }

    public openAddFriendDialog(): void {
        this.dialog.open(AddFriendComponent);
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
