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

@Injectable()
export class ChatService extends IsReadyService {
	public showChatWindow: boolean = false;
	private chats: Map<string[], Chat[]>;
	private chatSub: Subscription;

	constructor(private mqService: MqService,
	            private userProfileService: UserProfileService) {
		super(mqService, userProfileService);
		this.chats = new Map();
		this.init();
	}

	init(): void {
		this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady) {
				this.handleIncomingChats();
				this.setReady(true);
			}
		});
	}

	public unInit(): void {
		super.unInit();
	}

	public toggleChatWindow(): void {
		this.showChatWindow = !this.showChatWindow;
	}

	public getChats(userIds: string[]): Chat[] {
		let chats = this.chats.get(userIds);
		if (!isUndefined(chats)) {
			chats.sort((a: Chat, b: Chat) => {
				if (a.headers.timestamp < b.headers.timestamp) {
					return -1;
				}
				else if (a.headers.timestamp > b.headers.timestamp) {
					return 1;
				}
				return 0;
			});
			return chats;
		}

		return [];
	}

	public sendToUsers(userIds: string[], message: string): void {
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

	get chatRooms(): string[][] {
		return [...this.chats.keys()];
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
			let existingChats = this.chats.get(chat.headers.userIds);
			if (isUndefined(existingChats)) {
				this.chats.set(chat.headers.userIds, [chat]);
			}
			else {
				this.chats.get(chat.headers.userIds).push(chat);
			}
		});
	}
}