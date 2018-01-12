import { Component, EventEmitter, Output } from '@angular/core';
import { SocialService } from '../social.service';
import { UserProfile } from '../../types/userProfile';
import { MatDialogRef, MatTableDataSource } from '@angular/material';


@Component({
    templateUrl: 'select-friends.component.html',
    styleUrls: ['select-friends.component.css']
})
export class SelectFriendsComponent {
    @Output() public friendsSelected: EventEmitter<UserProfile[]> = new EventEmitter();

    public friendList: UserProfile[];
    public selectedFriends: UserProfile[];
    private friendDataSource: MatTableDataSource<UserProfile>;
    public friendColumns = ['icon', 'username', 'firstName', 'lastName'];

    constructor(private socialService: SocialService,
                private dialogRef: MatDialogRef<SelectFriendsComponent>) {
        this.selectedFriends = [];
        this.socialService.getFriends().subscribe((friendList: UserProfile[]) => {
            this.friendList = friendList;
            this.friendDataSource = new MatTableDataSource(this.friendList);
        });
    }

    selectFriend(friend: UserProfile): void {
        let newFriend = true;
        for (let i = 0; i < this.selectedFriends.length; i++) {
            if (friend._id === this.selectedFriends[i]._id) {
                this.selectedFriends.splice(i, 1);
                newFriend = false;
                friend['selected'] = false;
            }
        }
        if (newFriend) {
            this.selectedFriends.push(friend);
            friend['selected'] = true;
        }
    }

    applyFilter(filter: string): void {
        filter = filter.trim();
        filter = filter.toLowerCase();
        this.friendDataSource.filter = filter;
    }

    select(): void {
        this.friendsSelected.emit(this.selectedFriends);
        this.dialogRef.close();
    }
}