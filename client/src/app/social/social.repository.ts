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
}
