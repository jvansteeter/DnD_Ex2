import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../data-services/chat.service';
import { FriendService } from '../data-services/friend.service';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserProfile } from '../types/userProfile';
import { UserProfileService } from '../data-services/userProfile.service';
import { ChatRoom } from './chat-room';
import { isUndefined } from "util";

@Component({
	selector: 'app-chat',
	templateUrl: 'chat.component.html',
	styleUrls: ['chat.component.scss', 'resizable.css'],
})
export class ChatComponent implements OnInit {
	public chatContent: string;

	@ViewChild('auto') matAutocomplete: MatAutocomplete;
	@ViewChild('chipInput') chipInput: ElementRef<HTMLInputElement>;

	public toBarControl = new FormControl();
	separatorKeysCodes: number[] = [ENTER, COMMA];
	filteredFriends: Observable<UserProfile[]>;
	selectedIndex: number = 0;

	constructor(public chatService: ChatService,
	            public friendService: FriendService,
	            private userProfileService: UserProfileService) {
		this.filteredFriends = this.toBarControl.valueChanges.pipe(
				startWith(null),
				map((input: string | null) => input ? this.friendService.filterFriendsByUsername(input) : this.friendService.friends)
		);
	}

	public ngOnInit(): void {

	}

	public sendChat(): void {
		const room: ChatRoom = this.chatService.chatRooms[this.selectedIndex];
		this.chatService.sendToUsers(room.userIds, this.chatContent);
		this.chatContent = '';
	}

	public removeUser(userId: string): void {
		const room: ChatRoom = this.chatService.chatRooms[this.selectedIndex];
		room.removeUser(userId);
	}

	public addUserToChatRoom(username: string): void {
		const room: ChatRoom = this.chatService.chatRooms[this.selectedIndex];
		const user: UserProfile = this.friendService.getFriendByUserName(username);
		room.addUserId(user._id);
		this.chipInput.nativeElement.value = '';
		this.toBarControl.setValue(null);
	}

	public autoCompleteInput(event: MatChipInputEvent): void {
		if (!this.matAutocomplete.isOpen) {
			const input = event.input;
			let value = event.value;

			if ((value || '').trim()) {
				value = value.trim();
				if (!isUndefined(this.friendService.getFriendByUserName(value))) {
					this.addUserToChatRoom(value);
				}
				this.chipInput.nativeElement.value = '';
				this.toBarControl.setValue(null);
			}

			if (input) {
				input.value = '';
			}

			this.toBarControl.setValue(null);
		}
	}
}
