import { NgModule } from '@angular/core';
import { UserProfileService } from './services/userProfile.service';
import { NotificationsService } from './services/notifications.service';
import { DateFormatPipe } from './pipes/date-format.pipe';

@NgModule({
  declarations: [
    DateFormatPipe,
  ],
  providers: [
    UserProfileService,
    NotificationsService,
    DateFormatPipe
  ],
  exports: [
      DateFormatPipe
  ]
})
export class UtilityModule {

}