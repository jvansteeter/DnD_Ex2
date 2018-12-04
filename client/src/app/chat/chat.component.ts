import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../data-services/chat.service';
import { FriendService } from '../data-services/friend.service';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserProfile } from '../types/userProfile';

@Component({
	selector: 'app-chat',
	templateUrl: 'chat.component.html',
	styleUrls: ['chat.component.scss', 'resizable.css'],
})
export class ChatComponent {
	public chatContent: string;

	@ViewChild('auto') matAutocomplete: MatAutocomplete;
	@ViewChild('chipInput') chipInput: ElementRef<HTMLInputElement>;

	public toBarList: string[] = [];
	public toBarControl = new FormControl();
	separatorKeysCodes: number[] = [ENTER, COMMA];
	filteredFriends: Observable<UserProfile[]>;

	constructor(public chatService: ChatService,
	            public friendService: FriendService) {
		this.filteredFriends = this.toBarControl.valueChanges.pipe(
				startWith(null),
				map((input: string | null) => input ? this.friendService.filterFriendsByUsername(input) : this.friendService.friends)
		);
	}

	public sendChat(): void {
		const userIds = [];
		for (let username of this.toBarList) {
			let friend = this.friendService.getFriendByUserName(username);
			userIds.push(friend._id);
		}
		this.chatService.sendToUsers(userIds, this.chatContent);
		this.chatContent = '';
	}

	public removeChip(chip): void {
		this.toBarList.splice(this.toBarList.indexOf(chip), 1);
	}

	selected(event): void {
		this.toBarList.push(event.option.viewValue);
		this.chipInput.nativeElement.value = '';
		this.toBarControl.setValue(null);
	}

	add(event: MatChipInputEvent): void {
		if (!this.matAutocomplete.isOpen) {
			const input = event.input;
			const value = event.value;

			if ((value || '').trim()) {
				this.toBarList.push(value.trim());
			}

			if (input) {
				input.value = '';
			}

			this.toBarControl.setValue(null);
		}
	}
}
