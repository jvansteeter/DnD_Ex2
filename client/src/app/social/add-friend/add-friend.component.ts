import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SocialRepository } from '../social.repository';
import { UserProfile } from '../../types/userProfile';
import { MatDialogRef } from '@angular/material';


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

    constructor(private socialRepository: SocialRepository, private dialogRef: MatDialogRef<AddFriendComponent>) {
        this.userSubject = new Subject();
        this.userDataSource = new UserDataSource(this.userSubject);
        this.users = [];
    }

    public search(): void {
        this.socialRepository.findUsers(this.searchInput.nativeElement.value).subscribe((users: UserProfile[]) => {
            this.users = users;
            this.userSubject.next(users);
        });
    }

    public sendRequest(user: UserProfile): void {
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