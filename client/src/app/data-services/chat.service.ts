import { IsReadyService } from '../utilities/services/isReady.service';
import { MqService } from '../mq/mq.service';
import { Injectable } from '@angular/core';
import { Chat } from '../mq/messages/chat.message';
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';
import { ChatType } from '../../../../shared/types/mq/chat-type.enum';
import { UserProfileService } from './userProfile.service';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { filter, first, map, mergeMap, tap } from 'rxjs/operators';
import { StompMessage } from '../mq/messages/stomp-message';
import { isUndefined } from 'util';
import { ChatRoom } from '../chat/chat-room';
import { UserIdToUsernamePipe } from '../utilities/pipes/userId-to-username.pipe';
import { ChatRepository } from '../repositories/chat.repository';
import { ChatRoomData } from '../../../../shared/types/mq/chat-room.data';

@Injectable()
export class ChatService extends IsReadyService {
	public showChatWindow: boolean = false;
	private _chatRooms: Map<string, ChatRoom>;
	private chatSub: Subscription;
	private _totalUnreadCount: number;
	private newChatSubject: Subject<ChatRoom>;

	constructor(private mqService: MqService,
	            private userProfileService: UserProfileService,
	            private userIdToUsernamePipe: UserIdToUsernamePipe,
	            private chatRepo: ChatRepository) {
		super(mqService, userProfileService);
		this._chatRooms = new Map();
		this._totalUnreadCount = 0;
		this.newChatSubject = new Subject();
		this.init();
	}

	init(): void {
		this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady) {
				this.initRooms().pipe(first()).subscribe(() => {
					this.handleIncomingChats();
					this.setReady(true);
				});
			}
		});
	}

	public unInit(): void {
		super.unInit();
		if (this.chatSub) {
			this.chatSub.unsubscribe();
		}
	}

	private initRooms(): Observable<void> {
		return this.chatRepo.getAllChatRooms().pipe(
				tap((roomsData: ChatRoomData[]) => {
					for (let room of roomsData) {
						this._chatRooms.set(room._id, new ChatRoom(room));
					}
				}),
				mergeMap(() => {
					if (this._chatRooms.size === 0) {
						return this.chatRepo.createChatRoom().pipe(map((room: ChatRoomData) => {
							this._chatRooms.set(room._id, new ChatRoom(room));
						}));
					} else {
						return new BehaviorSubject<void>(null);
					}
				})
		);
	}

	public addUserToRoom(userId: string, roomId: string): void {
		this.chatRepo.addUserToRoom(userId, roomId).subscribe((room: ChatRoomData) => {
			const chatRoom: ChatRoom = this._chatRooms.get(room._id);
			chatRoom.userIds = room.userIds;
		});
	}

	public addNewChatRoom(): void {
		// const newRoom = new ChatRoom([this.userProfileService.userId], ChatType.USER);
		// newRoom.label = ChatRoom.NEW_CHAT;
		// this._chatRooms.set('test room', newRoom);
	}

	public toggleChatWindow(): void {
		this.showChatWindow = !this.showChatWindow;
	}

	public sendToUsers(room: ChatRoom, message: string): void {
		let containsLocalUserId = false;
		for (let userId of room.userIds) {
			if (userId === this.userProfileService.userId) {
				containsLocalUserId = true;
				break;
			}
		}
		if (!containsLocalUserId) {
			room.userIds.push(this.userProfileService.userId);
		}
		const chat: Chat = new Chat({
			headers: {
				type: MqMessageType.CHAT,
				chatType: ChatType.USER,
				fromUserId: this.userProfileService.userId,
				timestamp: new Date().getTime(),
				chatRoomId: room._id,
			},
			body: message
		});
		this.mqService.sendChat(chat, room);
	}

	get chatRooms(): ChatRoom[] {
		return [...this._chatRooms.values()];
	}

	get totalUnreadCount(): number {
		return this._totalUnreadCount;
	}

	get newChatObservable(): Observable<ChatRoom> {
		return this.newChatSubject.asObservable();
	}

	private handleIncomingChats(): void {
		this.chatSub = this.mqService.getIncomingUserMessages().pipe(
				filter((message: StompMessage) => message.headers.type === MqMessageType.CHAT),
				map((message: StompMessage) => {
					return message as Chat;
				}),
		).subscribe((chat: Chat) => {
			console.log(chat);
			// const newChatRoom = new ChatRoom(chat.headers.userIds, chat.headers.chatType);
			let existingChatRoom = this._chatRooms.get(chat.headers.chatRoomId);
			const isFromMe: boolean = this.userProfileService.userId === chat.headers.fromUserId;
			if (isFromMe && this._chatRooms.has(ChatRoom.NEW_CHAT)) {
				this._chatRooms.delete(ChatRoom.NEW_CHAT);
			}
			if (isUndefined(existingChatRoom)) {
				// const newChatRoom = new ChatRoom([], ChatType.USER);
				// newChatRoom.addChat(chat, isFromMe);
				// newChatRoom.label = this.makeChatRoomLabel(newChatRoom);
				// this._chatRooms.set(newChatRoom.hash(), newChatRoom);
			} else {
				existingChatRoom.addChat(chat, isFromMe);
				this.newChatSubject.next(existingChatRoom);
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