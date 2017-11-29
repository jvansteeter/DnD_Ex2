import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from './socket/socket.service';
import { SocketComponent } from './socket/socket.component';
import { UserProfileService } from './utilities/services/userProfile.service';
import { UserProfile } from './types/userProfile';
import { NotificationsService } from './utilities/services/notifications.service';
import { NotificationType } from './types/notification';

@Component({
  selector: 'web-app',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends SocketComponent implements OnInit {

    constructor(private router: Router,
                private userProfileService: UserProfileService,
                private notificationsService: NotificationsService,
                socketService: SocketService) {
        super(socketService);
        this.userProfileService.getUserProfile().then((userProfile: UserProfile) => {
            this.socketEmit('login', userProfile._id);
        });
        this.notifyOfFriendRequests();
        this.userProfileService.getFriends();
    }

    ngOnInit(): void {
        this.router.navigate(['/home']);
        this.socketOn('friendRequest').subscribe(() => {
            this.notifyOfFriendRequests();
            this.notificationsService.setNewNotifications(true);
        });
    }

    private notifyOfFriendRequests(): void {
        this.userProfileService.getPendingFriendRequests().then(() => {
            this.notificationsService.clearNotifications();
            this.userProfileService.friendRequests.forEach((requestFromUser: UserProfile) => {
                this.notificationsService.addNotification({
                    type: NotificationType.FRIEND_REQUEST,
                    message: requestFromUser.username
                }) ;
            });
        });
    }
}
