import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { UserProfile } from '../types/userProfile';

@Injectable()
export class SocialRepository {
    constructor(private http: HttpClient) {

    }

    public findUsers(criteria: string): Observable<any> {
        return this.http.post<UserProfile[]>('api/user/find', {search: criteria});
    }

    public sendFriendRequest(toUserId: string): void {
        this.http.post('api/social/friendrequest', {userId: toUserId}, {responseType: 'text'}).subscribe();
    }

    public acceptRequest(fromUserId: string): void {
        this.http.post('api/social/acceptrequest', {userId: fromUserId}, {responseType: 'text'}).subscribe();
    }

    public rejectFriendRequest(fromUserId: string): void {
        this.http.post('api/social/rejectrequest', {userId: fromUserId}, {responseType: 'text'}).subscribe();
    }

    public getPendingFriendRequests(): Observable<UserProfile[]> {
        return this.http.get<UserProfile[]>('api/social/pendingrequests', {responseType: 'json'});
    }

    public getFriends(): Observable<UserProfile[]> {
        return this.http.get<UserProfile[]>('api/social/friendlist', {responseType: 'json'});
    }
}
