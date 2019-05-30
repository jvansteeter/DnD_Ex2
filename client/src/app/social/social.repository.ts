import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../types/userProfile';
import { map } from 'rxjs/operators';

@Injectable()
export class SocialRepository {
	constructor(private http: HttpClient) {

	}

	public findUsers(criteria: string): Observable<any> {
		return this.http.post<UserProfile[]>('api/user/find', {search: criteria});
	}

	public sendRequest(toUserId: string): Observable<void> {
		return this.http.post<void>('/api/social/sendFriendRequest', {userId: toUserId});
	}

	public acceptRequest(fromUserId: string): Observable<void> {
		return this.http.post('api/social/acceptFriendRequest', {userId: fromUserId}, {responseType: 'text'}).pipe(map(() => {return;}));
	}

	// public rejectFriendRequest(fromUserId: string): void {
	// 	this.http.post('api/social/rejectFriendRequest', {userId: fromUserId}, {responseType: 'text'}).subscribe();
	// }

	public getFriends(): Observable<UserProfile[]> {
		return this.http.get<UserProfile[]>('api/social/friendList', {responseType: 'json'});
	}

	public getUserById(userId: string): Observable<UserProfile> {
		return this.http.get<UserProfile>('api/social/user/' + userId, {responseType: 'json'});
	}
}
