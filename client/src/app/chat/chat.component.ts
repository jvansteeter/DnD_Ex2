import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../data-services/chat.service';
import { FriendService } from '../data-services/friend.service';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatChipInputEvent } from '@angular/material';
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
	@ViewChild('chatHistory') chatHistory: ElementRef;

	public chatContent: string = '';
	public toBarControl = new FormControl();
	public separatorKeysCodes: number[] = [ENTER, COMMA];
	public filteredFriends: Observable<UserProfile[]>;
	public activeChatRoom: ChatRoom;
	public sideBarOpen: boolean = true;

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
		this.activeChatRoom = this.chatService.chatRooms[0];
		this.chatService.isReadyObservable.subscribe((isReady: boolean) => {
			if (isReady) {
				setTimeout(() => {
					this.activeChatRoom = this.chatService.chatRooms[0];
				});
				this.newChatSub = this.chatService.newChatObservable.subscribe((newChat: ChatRoom) => {
					if (newChat === this.activeChatRoom) {
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
		});
	}

	public ngOnDestroy(): void {
		if (this.newChatSub) {
			this.newChatSub.unsubscribe();
		}
	}

	@HostListener('mouseover')
	public onHover(): void {
		if (this.activeChatRoom.unreadChatCount > 0) {
			this.activeChatRoom.clearUnreadChatCount();
			this.chatService.checkRoom(this.activeChatRoom._id);
			this.chatService.calculateUnreadCount();
		}
	}

	public toggleSideBar(): void {
		this.sideBarOpen = !this.sideBarOpen;
	}

	public changeSelectedRoom(room: ChatRoom): void {
		this.activeChatRoom = this.chatService.getRoomById(room._id);
		this.chatService.checkRoom(room._id);
	}

	public sendChat(): void {
		this.chatContent = this.chatContent.trim();
		if (this.chatContent === '') {
			return;
		}
		this.chatService.sendToUsers(this.activeChatRoom, this.chatContent);
		this.chatContent = '';
	}

	public removeUser(userId: string): void {
		const userIds: any[] = JSON.parse(JSON.stringify(this.activeChatRoom.userIds));
		userIds.splice(userIds.indexOf(userId), 1);
		this.findRoomOfUsers(userIds);
	}

	public addUserToChatRoom(username: string): void {
		const user: UserProfile = this.friendService.getFriendByUserName(username);
		if (this.activeChatRoom.userIds.indexOf(user._id) === -1) {
			this.findRoomOfUsers([...this.activeChatRoom.userIds, user._id]);
		}
	}

	public addNewChatRoom(): void {
		this.activeChatRoom = this.chatService.addNewChatRoom();
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
			}

			if (input) {
				input.value = '';
			}

			this.chipInput.nativeElement.value = '';
			this.toBarControl.setValue(null);
		}
	}

	public minimizeChatWindow(): void {
		this.chatService.toggleChatWindow();
	}

	private findRoomOfUsers(userIds: string[]): void {
		this.chatService.getOrCreateRoomOfUsers(userIds).subscribe((room: ChatRoom) => {
			this.activeChatRoom = room;
		});
	}

	private filterFriends(input: string | null): UserProfile[] {
		let friendList = [];
		if (isNull(input)) {
			friendList = this.friendService.friends;
		}
		else {
			friendList = this.friendService.filterFriendsByUsername(input);
		}
		return friendList.filter((friend: UserProfile) => !this.activeChatRoom.userIds.includes(friend._id));
	}
}

