import { Component, EventEmitter, Output } from '@angular/core';
import { UserProfile } from '../../types/userProfile';
import { MatDialogRef, MatTableDataSource } from '@angular/material';
import { FriendService } from '../../data-services/friend.service';


@Component({
	templateUrl: 'select-friends.component.html',
	styleUrls: ['select-friends.component.css']
})
export class SelectFriendsComponent {
	@Output() public friendsSelected: EventEmitter<UserProfile[]> = new EventEmitter();

	public selectedFriends: UserProfile[];
	private friendDataSource: MatTableDataSource<UserProfile>;
	public friendColumns = ['icon', 'username', 'firstName', 'lastName'];

	constructor(private friendService: FriendService,
	            private dialogRef: MatDialogRef<SelectFriendsComponent>) {
		this.selectedFriends = [];
		this.friendService.getFriendsSubject().subscribe((friendList: UserProfile[]) => {
			this.friendDataSource = new MatTableDataSource(friendList);
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