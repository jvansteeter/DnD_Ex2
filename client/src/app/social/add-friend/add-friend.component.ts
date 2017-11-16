import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SocialRepository } from '../social.repository';
import { UserProfile } from '../../types/userProfile';
import { MatDialogRef } from '@angular/material';
import { SocialService } from '../social.service';


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

    constructor(private socialService: SocialService, private dialogRef: MatDialogRef<AddFriendComponent>) {
        this.userSubject = new Subject();
        this.userDataSource = new UserDataSource(this.userSubject);
        this.users = [];
    }

    public search(): void {
        this.socialService.findUsers(this.searchInput.nativeElement.value).subscribe((users: UserProfile[]) => {
            this.users = users;
            this.userSubject.next(users);
        });
    }

    public sendRequest(user: UserProfile): void {
        this.socialService.sendFriendRequest(user.id);
        this.dialogRef.close();
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