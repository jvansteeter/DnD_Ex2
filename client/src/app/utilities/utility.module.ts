import { NgModule } from '@angular/core';
import { UserProfileService } from '../data-services/userProfile.service';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { UserRepository } from '../repositories/user.repository';
import { NotificationService } from '../data-services/notification.service';

@NgModule({
  declarations: [
    DateFormatPipe,
  ],
  providers: [
    UserProfileService,
    NotificationService,
    DateFormatPipe,
	  UserRepository,
  ],
  exports: [
      DateFormatPipe
  ]
})
export class UtilityModule {

}