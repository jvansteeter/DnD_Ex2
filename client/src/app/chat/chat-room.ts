import { Chat } from '../mq/messages/chat.message';

export class ChatRoom {
	private _userIds: string[];
	private _chats: Chat[];

	constructor(userIds: string[]) {
		this._userIds = userIds;
		this._userIds.sort();
		this._chats = [];
	}

	public addChat(chat: Chat): void {
		this._chats.push(chat);
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

	public addUserId(userId: string): void {
		this._userIds.push(userId);
		this._userIds.sort();
	}

	public removeUser(userId: string): void {
		this._userIds.splice(this._userIds.indexOf(userId), 1);
	}

	get userIds(): string[] {
		return this._userIds;
	}

	get chats(): Chat[] {
		return this._chats;
	}

	public hash(): string {
		let hash = '';
		for (let id of this._userIds) {
			hash += id;
		}

		return hash;
	}
}