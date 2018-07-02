import { NgModule } from '@angular/core';
import { UserProfileService } from '../data-services/userProfile.service';
import { NotificationsService } from '../data-services/notifications.service';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { UserRepository } from '../repositories/user.repository';

@NgModule({
  declarations: [
    DateFormatPipe,
  ],
  providers: [
    UserProfileService,
    NotificationsService,
    DateFormatPipe,
	  UserRepository,
  ],
  exports: [
      DateFormatPipe
  ]
})
export class UtilityModule {

}