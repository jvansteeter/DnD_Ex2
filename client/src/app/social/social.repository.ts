import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../types/userProfile';
import { NotificationData } from '../../../../shared/types/notifications/NotificationData';
import { map } from 'rxjs/operators';

@Injectable()
export class SocialRepository {
	constructor(private http: HttpClient) {

	}

	public findUsers(criteria: string): Observable<any> {
		return this.http.post<UserProfile[]>('api/user/find', {search: criteria});
	}

	public acceptRequest(fromUserId: string): Observable<void> {
		return this.http.post('api/social/acceptFriendRequest', {userId: fromUserId}, {responseType: 'text'}).pipe(map(() => {return;}));
	}

	public rejectFriendRequest(fromUserId: string): void {
		this.http.post('api/social/rejectFriendRequest', {userId: fromUserId}, {responseType: 'text'}).subscribe();
	}

	public getPendingNotifications(): Observable<NotificationData[]> {
		return this.http.get<NotificationData[]>('api/user/pendingNotifications', {responseType: 'json'});
	}

	public getFriends(): Observable<UserProfile[]> {
		return this.http.get<UserProfile[]>('api/social/friendList', {responseType: 'json'});
	}

	public sendCampaignInvite(toUserId: string, campaignId: string): void {
		this.http.post('api/social/campaignInvite', {
			userId: toUserId,
			campaignId: campaignId
		}, {responseType: 'text'}).subscribe();
	}

	public getUserById(userId: string): Observable<UserProfile> {
		return this.http.get<UserProfile>('api/social/user/' + userId, {responseType: 'json'});
	}
}
