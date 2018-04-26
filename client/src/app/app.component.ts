import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from './socket/socket.service';
import { SocketComponent } from './socket/socket.component';
import { UserProfileService } from './utilities/services/userProfile.service';
import { UserProfile } from './types/userProfile';
import { NotificationsService } from './utilities/services/notifications.service';
import { AlertService } from './alert/alert.service';
import { NotificationType } from "../../../shared/types/notification-type";

@Component({
  selector: 'web-app',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends SocketComponent implements OnInit {

    constructor(private router: Router,
                private userProfileService: UserProfileService,
                private notificationsService: NotificationsService,
                private alertService: AlertService,
                socketService: SocketService) {
        super(socketService);
        this.userProfileService.getUserProfile().then((userProfile: UserProfile) => {
            this.socketEmit('login', userProfile._id);
        });
        this.notificationsService.getPendingFriendRequests();
        this.userProfileService.getFriends();
    }

    ngOnInit(): void {
        this.router.navigate(['/home']);
        this.socketOn('friendRequest').subscribe(() => {
            this.notificationsService.getPendingFriendRequests();
        });
        this.socketOn(NotificationType.CAMPAIGN_INVITE).subscribe((data) => {
            console.log('CampaignInvite')
            console.log(data)
        });
    }
}
