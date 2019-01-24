import { Chat } from '../mq/messages/chat.message';
import { ChatType } from '../../../../shared/types/mq/chat-type.enum';
import { ChatRoomData } from '../../../../shared/types/mq/chat-room.data';
import { isUndefined } from 'util';

export class ChatRoom implements ChatRoomData {
	_id: string;
	mostRecentTimestamp: number;
	private _userIds: string[];
	private _chats: Chat[];
	private _unreadChatCount: number;
	private _label: string;
	public lastChecked: {};
	readonly chatType: ChatType;

	public editable: boolean = true;
	public readonly isNew: boolean;

	static readonly NEW_CHAT = 'New Chat';

	constructor(data: ChatRoomData) {
		if (data.userIds.length === 0) {
			console.error('User creating chatroom must be present in room');
		}

		this._id = data._id;
		this.isNew = this._id === ChatRoom.NEW_CHAT;
		this.chatType = data.chatType;
		this._userIds = data.userIds;
		this._userIds.sort();
		this._label = data.label;
		this.lastChecked = isUndefined(data.lastChecked) ? {} : data.lastChecked;
		this._chats = [];
		this._unreadChatCount = 0;
		this.mostRecentTimestamp = data.mostRecentTimestamp;
		if (Array.isArray(data.chats) && data.chats.length > 0) {
			for (let chat of data.chats) {
				this._chats.push(new Chat(chat));
			}
			this.sortChats();
		}
	}

	public addChat(chat: Chat, isFromMe: boolean = false): void {
		this.editable = false;
		if (!isFromMe) {
			this._unreadChatCount++;
		}
		const timestamp = new Date().getTime();
		this.mostRecentTimestamp = timestamp;
		chat.headers.timestamp = timestamp;
		this._chats.push(chat);
		this.sortChats();
	}

	public addUserId(userId: string): void {
		this._userIds.push(userId);
		this._userIds.sort();
	}

	public removeUser(userId: string): void {
		this._userIds.splice(this._userIds.indexOf(userId), 1);
	}

	public clearUnreadChatCount(): void {
		this._unreadChatCount = 0;
	}

	get userIds(): string[] {
		return this._userIds;
	}

	set userIds(value) {
		this._userIds = value;
	}

	get chats(): Chat[] {
		return this._chats;
	}

	get label(): string {
		return this._label;
	}

	set label(value) {
		this._label = value;
	}

	get unreadChatCount(): number {
		return this._unreadChatCount;
	}

	public hash(): string {
		if (this._userIds.length === 1) {
			return ChatRoom.NEW_CHAT;
		}

		let hash = this.chatType.toString();
		for (let id of this._userIds) {
			hash += ',' + id;
		}

		return hash;
	}

	public calculateUnreadCount(lastChecked: number): void {
		for (let chat of this._chats) {
			if (chat.headers.timestamp > lastChecked) {
				this._unreadChatCount++;
			}
		}
	}

	private sortChats(): void {
		this._chats.sort((a: Chat, b: Chat) => {
			if (a.headers.timestamp < b.headers.timestamp) {
				return -1;
			}
			else if (a.headers.timestamp > b.headers.timestamp) {
				return 1;
			}
			return 0;
		});
	}
}