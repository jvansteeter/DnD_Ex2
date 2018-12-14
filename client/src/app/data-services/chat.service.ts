import { IsReadyService } from '../utilities/services/isReady.service';
import { MqService } from '../mq/mq.service';
import { Injectable } from '@angular/core';
import { Chat } from '../mq/messages/chat.message';
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';
import { ChatType } from '../../../../shared/types/mq/chat-type.enum';
import { UserProfileService } from './userProfile.service';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StompMessage } from '../mq/messages/stomp-message';
import { isUndefined } from 'util';
import { ChatRoom } from '../chat/chat-room';
import { UserIdToUsernamePipe } from '../utilities/pipes/userId-to-username.pipe';

@Injectable()
export class ChatService extends IsReadyService {
	public showChatWindow: boolean = false;
	private _chatRooms: Map<string, ChatRoom>;
	private chatSub: Subscription;
	private _totalUnreadCount: number;

	constructor(private mqService: MqService,
	            private userProfileService: UserProfileService,
	            private userIdToUsernamePipe: UserIdToUsernamePipe) {
		super(mqService, userProfileService);
		this._chatRooms = new Map();
		this._totalUnreadCount = 0;
		this.init();
	}

	init(): void {
		this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady) {
				this.addNewChatRoom();
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

	public addNewChatRoom(): void {
		const newRoom = new ChatRoom([this.userProfileService.userId], ChatType.USER);
		newRoom.label = ChatRoom.NEW_CHAT;
		this._chatRooms.set(ChatRoom.NEW_CHAT, newRoom);
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

	get totalUnreadCount(): number {
		return this._totalUnreadCount;
	}

	private handleIncomingChats(): void {
		this.chatSub = this.mqService.getIncomingUserMessages().pipe(
				filter((message: StompMessage) => message.headers.type === MqMessageType.CHAT),
				map((message: StompMessage) => {
					return message as Chat;
				}),
		).subscribe((chat: Chat) => {
			console.log(chat);
			const newChatRoom = new ChatRoom(chat.headers.userIds, chat.headers.chatType);
			// if (this._chatRooms.size === 1 && this._chatRooms.has(ChatRoom.NEW_CHAT) && newChatRoom.hash() !== ChatRoom.NEW_CHAT) {
			// 	this._chatRooms.clear();
			// }
			let existingChatRoom = this._chatRooms.get(newChatRoom.hash());
			const isFromMe: boolean = this.userProfileService.userId === chat.headers.fromUserId;
			if (isFromMe && this._chatRooms.has(ChatRoom.NEW_CHAT)) {
				this._chatRooms.delete(ChatRoom.NEW_CHAT);
			}
			if (isUndefined(existingChatRoom)) {
				newChatRoom.addChat(chat, isFromMe);
				newChatRoom.label = this.makeChatRoomLabel(newChatRoom);
				this._chatRooms.set(newChatRoom.hash(), newChatRoom);
			}
			else {
				existingChatRoom.addChat(chat, isFromMe);
			}

			this.calculateUnreadCount();
		});
	}

	public calculateUnreadCount(): void {
		let value = 0;
		for (let chatRoom of this.chatRooms) {
			value += chatRoom.unreadChatCount;
		}

		this._totalUnreadCount = value;
	}

	private makeChatRoomLabel(room: ChatRoom): string {
		let label = '';
		if (room.chatType === ChatType.USER) {
			for (let userId of room.userIds) {
				if (userId !== this.userProfileService.userId) {
					label += this.userIdToUsernamePipe.transform(userId) + ' ';
				}
			}
			label.trim();
		}

		return label;
	}
}