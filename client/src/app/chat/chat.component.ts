import { Component } from '@angular/core';
import { ChatService } from '../data-services/chat.service';
import { FriendService } from '../data-services/friend.service';

@Component({
	selector: 'app-chat',
	templateUrl: 'chat.component.html',
	styleUrls: ['chat.component.scss', 'resizable.css'],
})
export class ChatComponent {
	public chatContent: string;

	constructor(public chatService: ChatService,
	            public friendService: FriendService) {

	}

	public sendChat(): void {
		let friend = this.friendService.getFriendByUserName('qwer');
		this.chatService.sendToUsers([friend._id], this.chatContent);
		this.chatContent = '';
	}
}
