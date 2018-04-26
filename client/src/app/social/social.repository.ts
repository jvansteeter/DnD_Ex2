import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { UserProfile } from '../types/userProfile';
import { NotificationData } from "../../../../shared/types/notification-data";

@Injectable()
export class SocialRepository {
    constructor(private http: HttpClient) {

    }

    public findUsers(criteria: string): Observable<any> {
        return this.http.post<UserProfile[]>('api/user/find', {search: criteria});
    }

    public sendFriendRequest(toUserId: string): void {
        this.http.post('api/social/friendRequest', {userId: toUserId}, {responseType: 'text'}).subscribe();
    }

    public acceptRequest(fromUserId: string): void {
        this.http.post('api/social/acceptRequest', {userId: fromUserId}, {responseType: 'text'}).subscribe();
    }

    public rejectFriendRequest(fromUserId: string): void {
        this.http.post('api/social/rejectRequest', {userId: fromUserId}, {responseType: 'text'}).subscribe();
    }

    public getPendingFriendRequests(): Observable<UserProfile[]> {
        return this.http.get<UserProfile[]>('api/social/pendingRequests', {responseType: 'json'});
    }

    public getPendingNotifications(): Observable<NotificationData[]> {
        return this.http.get<NotificationData[]>('api/social/pendingNotifications', {responseType: 'json'});
    }

    public getFriends(): Observable<UserProfile[]> {
        return this.http.get<UserProfile[]>('api/social/friendList', {responseType: 'json'});
    }

    public sendCampaignInvite(toUserId: string, campaignId: string): void {
        this.http.post('api/social/campaignInvite', {userId: toUserId, campaignId: campaignId}, {responseType: 'text'}).subscribe();
    }

}
