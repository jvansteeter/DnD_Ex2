import { Injectable } from '@angular/core';
import { SocialRepository } from './social.repository';
import { Observable } from 'rxjs/Observable';
import { UserProfile } from '../types/userProfile';
import { first, tap } from 'rxjs/operators';

@Injectable()
export class FriendService {
	public friends: UserProfile[];

	constructor(private socialRepo: SocialRepository) {
		this.friends = [];
		this.getFriends().pipe(first()).subscribe();
	}

	public getFriends(): Observable<UserProfile[]> {
		return this.socialRepo.getFriends().pipe(tap((friends: UserProfile[]) => this.friends = friends));
	}
}