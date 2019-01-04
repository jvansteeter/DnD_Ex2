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
import { isNullOrUndefined, isUndefined } from 'util';
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
		newRoom.label = this.makeChatRoomLabel(newRoom);
		this._chatRooms.set(data._id, newRoom);
		return newRoom;
	}

	public addUserToRoom(userId: string, roomId: string): void {
		// this.chatRepo.addUserToRoom(userId, roomId).subscribe((room: ChatRoomData) => {
			const chatRoom: ChatRoom = this._chatRooms.get(roomId);
			chatRoom.addUserId(userId);
			chatRoom.label = this.makeChatRoomLabel(chatRoom);
		// });
	}

	public addNewChatRoom(): void {
		this._chatRooms.set(ChatRoom.NEW_CHAT, new ChatRoom({
			_id: ChatRoom.NEW_CHAT,
			userIds: [this.userProfileService.userId],
			label: 'New',
			chatType: ChatType.USER,
			mostRecentTimestamp: new Date().getTime(),
		}));
		// this.chatRepo.createChatRoom().subscribe((room: ChatRoomData) => {
		// 	this._chatRooms.set(room._id, new ChatRoom(room));
		// });
	}

	public toggleChatWindow(): void {
		this.showChatWindow = !this.showChatWindow;
	}

	public getRoomById(id: string): ChatRoom {
		return this._chatRooms.get(id);
	}

	public sendToUsers(room: ChatRoom, message: string): void {
		console.log('\n\nsendToUsers\n\n')
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

	public getOrCreateRoomOfUsers(room: ChatRoom): Observable<ChatRoom> {
		return this.chatRepo.getOrCreateRoomOfUsers(room.userIds).pipe(map((roomData: ChatRoomData) => {
			console.log(roomData)
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
			// const newChatRoom = new ChatRoom(chat.headers.userIds, chat.headers.chatType);
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

	private makeChatRoomLabel(room: ChatRoom): string {
		if (room.userIds.length <= 1) {
			return 'New';
		}
		let label = '';
		if (room.chatType === ChatType.USER) {
			for (let userId of room.userIds) {
				if (userId !== this.userProfileService.userId) {
					label += ', ' + this.userIdToUsernamePipe.transform(userId);
				}
			}
			label = label.substr(2);
		}

		return label;
	}
}