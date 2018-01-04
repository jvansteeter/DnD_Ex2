import { Component } from '@angular/core';
import { SocialService } from '../social.service';
import { UserProfile } from '../../types/userProfile';
import { SubjectDataSource } from '../../utilities/subjectDataSource';
import { Subject } from 'rxjs/Subject';


@Component({
    templateUrl: 'select-friends.component.html',
    styleUrls: ['select-friends.component.css']
})
export class SelectFriendsComponent {

    public friendList: UserProfile[];
    private friendDataSource: SubjectDataSource<UserProfile>;
    private friendSubject: Subject<UserProfile[]>;
    public friendColumns = ['icon', 'username', 'firstName', 'lastName'];

    constructor(private socialService: SocialService) {
        this.friendSubject = new Subject<UserProfile[]>();
        this.friendDataSource = new SubjectDataSource(this.friendSubject);
        this.socialService.getFriends().subscribe((friendList: UserProfile[]) => {
            this.friendList = friendList;
            this.friendSubject.next(friendList);
        });
    }

    selectFriend(friend): void {
        console.log(friend)
    }
}