import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { UserProfile } from '../../types/userProfile';
import { MatDialogRef } from '@angular/material';
import { SocialService } from '../social.service';
import { UserProfileService } from '../../data-services/userProfile.service';
import { FriendService } from '../../data-services/friend.service';
import { SubjectDataSource } from '../../utilities/subjectDataSource';
import { NotificationService } from '../../data-services/notification.service';


@Component({
    selector: 'add-friend',
    templateUrl: 'add-friend.component.html',
    styleUrls: ['add-friend.component.css']
})
export class AddFriendComponent {
    @ViewChild('searchCriteria') private searchInput: ElementRef;
    private userDataSource: SubjectDataSource<UserProfile>;
    private readonly userSubject: Subject<UserProfile[]>;
    public tableColumns = ['user', 'actions'];

    public users: UserProfile[];
    public noUsersError: boolean;

    constructor(private socialService: SocialService,
                private dialogRef: MatDialogRef<AddFriendComponent>,
                private userProfileService: UserProfileService,
                private notificationsService: NotificationService,
                private friendService: FriendService) {
        this.userSubject = new Subject();
        this.userDataSource = new SubjectDataSource<UserProfile>(this.userSubject);
        this.users = [];
        this.noUsersError = false;
    }

    public search(): void {
        this.socialService.findUsers(this.searchInput.nativeElement.value).subscribe((users: UserProfile[]) => {
            for (let i = 0; i < users.length; i++) {
                if (this.userProfileService.userId === users[i]._id) {
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
        this.friendService.sendFriendRequest(user._id);
        this.dialogRef.close();
    }

    public acceptRequest(user: UserProfile): void {
        this.friendService.acceptRequest(user._id);
        this.notificationsService.removeFriendRequest(user._id);
        this.dialogRef.close();
    }

    public rejectRequest(user: UserProfile): void {
        this.friendService.rejectFriendRequest(user._id);
        this.notificationsService.removeFriendRequest(user._id);
        this.dialogRef.close();
    }

    public hasPendingRequestFrom(user: UserProfile): boolean {
        // for (let i = 0; i < this.notificationService.friendRequests.length; i++) {
        //     if (this.notificationService.friendRequests[i]._id === user._id) {
        //         return true;
        //     }
        // }

        return false;
    }
}
