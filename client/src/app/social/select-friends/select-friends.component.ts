import { Component } from '@angular/core';
import { UserProfile } from '../../types/userProfile';
import { MatDialogRef } from '@angular/material';
import { FriendService } from '../../data-services/friend.service';
import { SubjectDataSource } from '../../utilities/subjectDataSource';


@Component({
	templateUrl: 'select-friends.component.html',
	styleUrls: ['select-friends.component.css']
})
export class SelectFriendsComponent {
	public selectedFriends: UserProfile[];
	private friendDataSource: SubjectDataSource<UserProfile>;
	public friendColumns = ['icon', 'username', 'firstName', 'lastName'];

	constructor(private friendService: FriendService,
	            private dialogRef: MatDialogRef<SelectFriendsComponent>) {
		this.selectedFriends = [];
		this.friendDataSource = new SubjectDataSource<UserProfile>(this.friendService.getFriendsSubject());
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
		this.dialogRef.close(this.selectedFriends);
	}
}