import { IsReadyService } from '../utilities/services/isReady.service';
import { MqService } from '../mq/mq.service';
import { Injectable } from '@angular/core';
import { Chat } from '../mq/messages/chat.message';
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';
import { ChatType } from '../../../../shared/types/mq/chat-type.enum';
import { UserProfileService } from './userProfile.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { StompMessage } from '../mq/messages/stomp-message';
import { isUndefined } from 'util';
import { ChatRoom } from '../chat/chat-room';
import { ChatRepository } from '../repositories/chat.repository';
import { ChatRoomData } from '../../../../shared/types/mq/chat-room.data';
import { SocialService } from '../social/social.service';

@Injectable()
export class ChatService extends IsReadyService {
	public showChatWindow: boolean = false;
	private _chatRooms: Map<string, ChatRoom>;
	private chatSub: Subscription;
	private _totalUnreadCount: number;
	private newChatSubject: Subject<ChatRoom>;

	constructor(private mqService: MqService,
	            private userProfileService: UserProfileService,
	            private socialService: SocialService,
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
				map((roomsData: ChatRoomData[]) => {
					for (let room of roomsData) {
						this.initRoom(room);
					}
					if (this._chatRooms.size === 0) {
						this.addNewChatRoom();
					}
					return;
				})
		);
	}

	private initRoom(data: ChatRoomData): ChatRoom {
		let newRoom: ChatRoom = new ChatRoom(data);
		this._chatRooms.set(data._id, newRoom);
		return newRoom;
	}

	public addNewChatRoom(): ChatRoom {
		const newRoom = new ChatRoom({
			_id: ChatRoom.NEW_CHAT,
			userIds: [this.userProfileService.userId],
			label: 'New',
			chatType: ChatType.USER,
			mostRecentTimestamp: new Date().getTime(),
		});
		this._chatRooms.set(ChatRoom.NEW_CHAT, newRoom);
		return newRoom;
	}

	public toggleChatWindow(): void {
		this.showChatWindow = !this.showChatWindow;
	}

	public getRoomById(id: string): ChatRoom {
		return this._chatRooms.get(id);
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
		this.chatRepo.saveChat(chat).subscribe();
	}

	public getOrCreateRoomOfUsers(userIds: string[]): Observable<ChatRoom> {
		return this.chatRepo.getOrCreateRoomOfUsers(userIds).pipe(map((roomData: ChatRoomData) => {
			if (!isUndefined(this._chatRooms.get(ChatRoom.NEW_CHAT)) && !isUndefined(roomData)) {
				this._chatRooms.delete(ChatRoom.NEW_CHAT);
			}
			return this.initRoom(roomData);
		}));
	}

	get chatRooms(): ChatRoom[] {
		return [...this._chatRooms.values()].sort((a: ChatRoom, b: ChatRoom) => {
			return b.mostRecentTimestamp - a.mostRecentTimestamp;
		});
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
			let existingChatRoom = this._chatRooms.get(chat.headers.chatRoomId);
			const isFromMe: boolean = this.userProfileService.userId === chat.headers.fromUserId;
			if (isFromMe && this._chatRooms.has(ChatRoom.NEW_CHAT)) {
				this._chatRooms.delete(ChatRoom.NEW_CHAT);
			}
			if (isUndefined(existingChatRoom)) {
				this.initRooms().subscribe();
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
}
