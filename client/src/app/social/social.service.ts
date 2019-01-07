import { Injectable } from '@angular/core';
import { SocialRepository } from './social.repository';
import { Observable } from 'rxjs';
import { IsReadyService } from '../utilities/services/isReady.service';
import { FriendService } from '../data-services/friend.service';
import { isUndefined } from 'util';
import { UserRepository } from '../repositories/user.repository';
import { UserProfile } from '../types/userProfile';

@Injectable()
export class SocialService extends IsReadyService {
	private usernameCache: Map<string, string>;
	constructor(private socialRepo: SocialRepository, private friendService: FriendService, private userRepo: UserRepository) {
		super(friendService);
		this.init();
	}

	public init(): void {
		this.usernameCache = new Map();
		this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady && !this.isReady()) {
				for (let friend of this.friendService.friends) {
					this.usernameCache.set(friend._id, friend.username);
				}
				this.setReady(true);
			}
			else {
				this.setReady(false);
			}
		});
	}

	public findUsers(criteria: string): Observable<any> {
		return this.socialRepo.findUsers(criteria);
	}

	public getUsernameByUserId(userId: string): string {
		let username: string = this.usernameCache.get(userId);
		if (isUndefined(username)) {
			this.userRepo.getUserById(userId).subscribe((user: UserProfile) => {
				this.usernameCache.set(user._id, user.username);
			});
			this.usernameCache.set(userId, 'pending')
			return userId;
		}
		else {
			return username;
		}
	}
}