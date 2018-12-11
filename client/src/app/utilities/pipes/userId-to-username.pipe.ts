import { Pipe, PipeTransform } from '@angular/core';
import { UserProfileService } from '../../data-services/userProfile.service';
import { FriendService } from '../../data-services/friend.service';
import { UserProfile } from '../../types/userProfile';
import { isUndefined } from 'util';

@Pipe({
	name: 'userIdToUsername'
})
export class UserIdToUsernamePipe implements PipeTransform {
	constructor(private userProfileService: UserProfileService,
	            private friendService: FriendService) {

	}

	transform(value: any, ...args: any[]): any {
		if (value === this.userProfileService.userId) {
			return this.userProfileService.username;
		}

		let friend: UserProfile = this.friendService.getFriendByUserId(value);
		if (!isUndefined(friend)) {
			return friend.username;
		}

		return '';
	}
}