import { Pipe, PipeTransform } from '@angular/core';
import { FriendService } from '../../data-services/friend.service';
import { UserRepository } from '../../repositories/user.repository';
import { SocialService } from '../../social/social.service';

@Pipe({
	name: 'userIdToUsername',
	pure: false
})
export class UserIdToUsernamePipe implements PipeTransform {
	private usernameCache: Map<string, string>;
	constructor(private friendService: FriendService,
	            private userRepo: UserRepository,
	            private socialService: SocialService) {
		this.usernameCache = new Map();
	}

	transform(userId: any, ...args: any[]): any {
		return this.socialService.getUsernameByUserId(userId);
	}
}