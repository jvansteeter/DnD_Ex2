import { NgModule } from '@angular/core';
import {
	MatBadgeModule,
	MatButtonModule,
	MatCardModule,
	MatGridListModule, MatIconModule, MatListModule,
	MatMenuModule,
	MatSidenavModule,
	MatSortModule,
	MatToolbarModule
} from '@angular/material';
import { MainNavComponent } from './main-nav.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { NotificationComponent } from './notification/notification.component';
import { FriendRequestNotificationComponent } from './notification/notification-components/friend-request-notification.component';
import { NotificationService } from '../data-services/notification.service';
import { NotificationRepository } from '../repositories/notification.repository';
import { UserProfileService } from '../data-services/userProfile.service';
import { UserRepository } from '../repositories/user.repository';
import { CampaignInviteNotificationComponent } from './notification/notification-components/campaign-invite-notification.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        MatSortModule,
        MatGridListModule,
        MatCardModule,
        MatMenuModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        AppRoutingModule,
		    MatBadgeModule,
    ],
    declarations: [
        MainNavComponent,
		    NotificationComponent,
		    FriendRequestNotificationComponent,
		    CampaignInviteNotificationComponent,
    ],
    providers: [
    		NotificationService,
		    NotificationRepository,
		    UserProfileService,
		    UserRepository,
    ],
    exports: [
        MainNavComponent
    ]
})
export class MainNavModule {}