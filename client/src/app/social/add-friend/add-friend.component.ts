import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { UserProfile } from '../../types/userProfile';
import { MatDialogRef } from '@angular/material';
import { SocialService } from '../social.service';
import { UserProfileService } from '../../utilities/services/userProfile.service';
import { NotificationsService } from '../../utilities/services/notifications.service';
import { FriendService } from '../friend.service';


@Component({
    selector: 'add-friend',
    templateUrl: 'add-friend.component.html',
    styleUrls: ['add-friend.component.css']
})
export class AddFriendComponent {
    @ViewChild('searchCriteria') private searchInput: ElementRef;
    private userDataSource: UserDataSource;
    private userSubject: Subject<UserProfile[]>;
    public tableColumns = ['user', 'actions'];

    public users: UserProfile[];
    public noUsersError: boolean;

    constructor(private socialService: SocialService,
                private dialogRef: MatDialogRef<AddFriendComponent>,
                private userProfileService: UserProfileService,
                private notificationsService: NotificationsService,
                private friendService: FriendService) {
        this.userSubject = new Subject();
        this.userDataSource = new UserDataSource(this.userSubject);
        this.users = [];
        this.noUsersError = false;
    }

    public search(): void {
        this.socialService.findUsers(this.searchInput.nativeElement.value).subscribe((users: UserProfile[]) => {
            for (let i = 0; i < users.length; i++) {
                if (this.userProfileService.getUserId() === users[i]._id) {
                    users.splice(i, 1);
                    i--;
                }
                else {
                    for (let j = 0; j < this.friendService.friends.length; j++) {
                        let friend = this.friendService.friends[j];
                        if (users[i]._id === friend._id) {
                            users.splice(i, 1);
                            i--;
                            break;
                        }
                    }
                }
            }
            this.noUsersError = users.length === 0;
            this.users = users;
            this.userSubject.next(users);
        });
    }

    public sendRequest(user: UserProfile): void {
        this.socialService.sendFriendRequest(user._id);
        this.dialogRef.close();
    }

    public acceptRequest(user: UserProfile): void {
        this.socialService.acceptRequest(user._id);
        this.notificationsService.removeFriendRequest(user._id);
        this.dialogRef.close();
    }

    public rejectRequest(user: UserProfile): void {
        this.socialService.rejectFriendRequest(user._id);
        this.notificationsService.removeFriendRequest(user._id);
        this.dialogRef.close();
    }

    public hasPendingRequestFrom(user: UserProfile): boolean {
        for (let i = 0; i < this.notificationsService.friendRequests.length; i++) {
            if (this.notificationsService.friendRequests[i]._id === user._id) {
                return true;
            }
        }

        return false;
    }
}

class UserDataSource extends DataSource<UserProfile> {
    constructor(private userSubject: Subject<UserProfile[]>) {
        super();
    }

    connect(): Observable<UserProfile[]> {
        return this.userSubject.asObservable();
    }

    disconnect(): void {
    }
}