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
import { ChatMessage } from '../../../../shared/types/mq/chat';

@Injectable()
export class ChatService extends IsReadyService {
	public showChatWindow: boolean = false;
	private chats: Map<string[], string[]>;
	private chatSub: Subscription;

	constructor(private mqService: MqService,
	            private userProfileService: UserProfileService) {
		super(mqService, userProfileService);
		this.chats = new Map();
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

	public sendToUsers(userIds: string[], message: string): void {
		const chat: Chat = new Chat({
			headers: {
				type: MqMessageType.CHAT,
				chatType: ChatType.USER,
				fromUserId: this.userProfileService.userId,
				userIds: userIds
			},
			body: message
		});
		this.mqService.sendChat(chat);
	}

	private handleIncomingChats(): void {
		this.chatSub = this.mqService.getIncomingUserMessages().pipe(
				filter((message: StompMessage) => message.headers.type === MqMessageType.CHAT),
				map((message: StompMessage) => {
					return message as Chat;
				}),
		).subscribe((chat: Chat) => {
			console.log(chat);
		})
	}
}