import { Injectable } from '@angular/core';
import { SocialRepository } from './social.repository';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SocialService {
    constructor(private socialRepo: SocialRepository) {}

    public findUsers(criteria: string): Observable<any> {
        return this.socialRepo.findUsers(criteria);
    }

    public sendFriendRequest(toUserId: string): void {
        this.socialRepo.sendFriendRequest(toUserId);
    }
}