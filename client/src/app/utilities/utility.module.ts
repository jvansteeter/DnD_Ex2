import { NgModule } from '@angular/core';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { UserIdToUsernamePipe } from './pipes/userId-to-username.pipe';
import { UserProfileService } from '../data-services/userProfile.service';
import { FriendService } from '../data-services/friend.service';

@NgModule({
	declarations: [
		DateFormatPipe,
		UserIdToUsernamePipe,
	],
	providers: [
		DateFormatPipe,
		UserIdToUsernamePipe,
		UserProfileService,
		FriendService,
	],
	exports: [
		DateFormatPipe,
		UserIdToUsernamePipe,
	]
})
export class UtilityModule {

}