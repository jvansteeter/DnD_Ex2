import { IsReadyService } from '../utilities/services/isReady.service';
import { MqService } from '../mq/mq.service';
import { Injectable } from '@angular/core';
import { Chat } from '../mq/messages/chat.message';
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';
import { ChatType } from '../../../../shared/types/mq/chat-type.enum';
import { UserProfileService } from './userProfile.service';
import { Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { StompMessage } from '../mq/messages/stomp-message';
import { isUndefined } from 'util';
import { ChatRoom } from '../chat/chat-room';
import { UserIdToUsernamePipe } from '../utilities/pipes/userId-to-username.pipe';

@Injectable()
export class ChatService extends IsReadyService {
	public showChatWindow: boolean = false;
	private _chatRooms: Map<string, ChatRoom>;
	private chatSub: Subscription;

	constructor(private mqService: MqService,
	            private userProfileService: UserProfileService,
	            private userIdToUsernamePipe: UserIdToUsernamePipe) {
		super(mqService, userProfileService);
		this._chatRooms = new Map();
		this.init();
	}

	init(): void {
		this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady) {
				const newChat = new ChatRoom([], this.userIdToUsernamePipe);
				this._chatRooms.set(newChat.hash(), newChat);
				this.handleIncomingChats();
				this.setReady(true);
			}
		});
	}

	public unInit(): void {
		super.unInit();
		if (this.chatSub) {
			this.chatSub.unsubscribe();
		}
	}

	public toggleChatWindow(): void {
		this.showChatWindow = !this.showChatWindow;
	}

	public sendToUsers(userIds: string[], message: string): void {
		let containsLocalUserId = false;
		for (let userId of userIds) {
			if (userId === this.userProfileService.userId) {
				containsLocalUserId = true;
				break;
			}
		}
		if (!containsLocalUserId) {
			userIds.push(this.userProfileService.userId);
		}
		const chat: Chat = new Chat({
			headers: {
				type: MqMessageType.CHAT,
				chatType: ChatType.USER,
				fromUserId: this.userProfileService.userId,
				timestamp: new Date().getTime(),
				userIds: userIds,
			},
			body: message
		});
		this.mqService.sendChat(chat);
	}

	get chatRooms(): ChatRoom[] {
		return [...this._chatRooms.values()];
	}

	private handleIncomingChats(): void {
		this.chatSub = this.mqService.getIncomingUserMessages().pipe(
				tap(() => console.log('here')),
				filter((message: StompMessage) => message.headers.type === MqMessageType.CHAT),
				map((message: StompMessage) => {
					return message as Chat;
				}),
		).subscribe((chat: Chat) => {
			console.log(chat);
			const newChatRoom = new ChatRoom(chat.headers.userIds, this.userIdToUsernamePipe);
			if (this._chatRooms.size === 1 && this._chatRooms.has('')) {
				this._chatRooms.clear();
			}
			let existingChatRoom = this._chatRooms.get(newChatRoom.hash());
			if (isUndefined(existingChatRoom)) {
				newChatRoom.addChat(chat);
				this._chatRooms.set(newChatRoom.hash(), newChatRoom);
			}
			else {
				existingChatRoom.addChat(chat);
			}
		});
	}
}