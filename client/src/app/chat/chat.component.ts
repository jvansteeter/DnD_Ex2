import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../data-services/chat.service';
import { FriendService } from '../data-services/friend.service';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatChipInputEvent, MatTabGroup } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserProfile } from '../types/userProfile';
import { UserProfileService } from '../data-services/userProfile.service';
import { ChatRoom } from './chat-room';
import { isNull, isUndefined } from "util";

@Component({
	selector: 'app-chat',
	templateUrl: 'chat.component.html',
	styleUrls: ['chat.component.scss', 'resizable.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
	@ViewChild('auto') matAutocomplete: MatAutocomplete;
	@ViewChild('chipInput') chipInput: ElementRef<HTMLInputElement>;
	@ViewChild('tabGroup') tabGroup: MatTabGroup;
	@ViewChild('chatHistory') chatHistory: ElementRef;

	public chatContent: string = '';
	public toBarControl = new FormControl();
	public separatorKeysCodes: number[] = [ENTER, COMMA];
	public filteredFriends: Observable<UserProfile[]>;

	private selectedIndex: number = 0;
	private newChatSub: Subscription;

	constructor(public chatService: ChatService,
	            public friendService: FriendService,
	            private userProfileService: UserProfileService) {
		this.filteredFriends = this.toBarControl.valueChanges.pipe(
				startWith(null),
				map((input: string | null) => this.filterFriends(input))
		);
	}

	public ngOnInit(): void {
		this.newChatSub = this.chatService.newChatObservable.subscribe((newChat: ChatRoom) => {
			const activeRoom: ChatRoom = this.chatService.chatRooms[this.selectedIndex];
			if (newChat === activeRoom) {
				setTimeout(() => {
					this.chatHistory.nativeElement.scrollTo({
						top: this.chatHistory.nativeElement.scrollHeight,
						left: 0,
						behavior: 'smooth'
					});
				});
			}
		});
	}

	public ngOnDestroy(): void {
		if (this.newChatSub) {
			this.newChatSub.unsubscribe();
		}
	}

	@HostListener('mouseover')
	public onHover(): void {
		const room: ChatRoom = this.chatService.chatRooms[this.selectedIndex];
		if (room.unreadChatCount > 0) {
			room.clearUnreadChatCount();
			this.chatService.calculateUnreadCount();
		}
	}

	public selectedTabIndexChange(index: number): void {
		this.selectedIndex = index;
	}

	public sendChat(): void {
		this.chatContent = this.chatContent.trim();
		if (this.chatContent === '') {
			return;
		}
		const room: ChatRoom = this.chatService.chatRooms[this.selectedIndex];
		this.chatService.sendToUsers(room, this.chatContent);
		this.chatContent = '';
	}

	public removeUser(userId: string): void {
		const room: ChatRoom = this.chatService.chatRooms[this.selectedIndex];
		room.removeUser(userId);
	}

	public addUserToChatRoom(username: string): void {
		// const room: ChatRoom = this.chatService.chatRooms[this.selectedIndex];
		// const user: UserProfile = this.friendService.getFriendByUserName(username);
		// if (room.userIds.includes(user._id)) {
		// 	return;
		// }
		// room.addUserId(user._id);
		// this.chipInput.nativeElement.value = '';
		// this.toBarControl.setValue(null);

		const room: ChatRoom = this.chatService.chatRooms[this.selectedIndex];
		const user: UserProfile = this.friendService.getFriendByUserName(username);
		this.chatService.addUserToRoom(user._id, room._id);
	}

	public addNewChatRoom(): void {
		this.chatService.addNewChatRoom();
		setTimeout(() => {
			this.selectedIndex = this.tabGroup._tabs.length - 1;
			this.tabGroup.selectedIndex = this.selectedIndex;
		});
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

	private filterFriends(input: string | null): UserProfile[] {
		let friendList = [];
		if (isNull(input)) {
			friendList = this.friendService.friends;
		}
		else {
			friendList = this.friendService.filterFriendsByUsername(input);
		}
		const room = this.chatService.chatRooms[this.selectedIndex];
		return friendList.filter((friend: UserProfile) => !room.userIds.includes(friend._id));
	}
}
