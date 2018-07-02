import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileService } from './data-services/userProfile.service';
import { NotificationsService } from './data-services/notifications.service';

@Component({
  selector: 'web-app',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(private router: Router,
                private userProfileService: UserProfileService,
                private notificationsService: NotificationsService) {
        this.notificationsService.getPendingFriendRequests();
    }

    ngOnInit(): void {
        this.router.navigate(['/home']);
    }
}
