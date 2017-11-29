import { NgModule } from '@angular/core';
import { UserProfileService } from './services/userProfile.service';
import { NotificationsService } from './services/notifications.service';

@NgModule({
    providers: [
        UserProfileService,
        NotificationsService
    ]
})
export class UtilityModule {

}