import * as mongoose from 'mongoose';
import { ChatRoomModel } from '../models/chat-room.model';
import { ChatType } from '../../../../shared/types/mq/chat-type.enum';
import { ChatModel } from '../models/chat.model';
import { ChatMessage } from '../../../../shared/types/mq/chat';

export class ChatRepository {
	private ChatRoom: mongoose.Model<mongoose.Document>;
	private Chat: mongoose.Model<mongoose.Document>;

	constructor() {
		this.ChatRoom = mongoose.model('ChatRoom');
		this.Chat = mongoose.model('Chat');
	}

	public createChatRoom(type: ChatType): Promise<ChatRoomModel> {
		return new Promise<ChatRoomModel>((resolve, reject) => {
			this.ChatRoom.create({
				chatType: type,
				mostRecentTimestamp: new Date().getTime(),
				lastChecked: {},
			}, (error, room: ChatRoomModel) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(room);
			});
		});
	}

	public createChat(chat: ChatMessage): Promise<ChatModel> {
		return new Promise((resolve, reject) => {
			this.Chat.create({
				chatType: chat.headers.chatType,
				fromUserId: chat.headers.fromUserId,
				timestamp: chat.headers.timestamp,
				chatRoomId: chat.headers.chatRoomId,
				body: chat.body,
			}, (error, chatModel: ChatModel) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(chatModel);
			});
		});
	}

	public getAllChatRooms(userId: string): Promise<ChatRoomModel[]> {
		return new Promise((resolve, reject) => {
			this.ChatRoom.find({
				userIds: userId
			})
			.sort({mostRecentTimestamp: 'desc'})
			.exec((error, rooms: ChatRoomModel[]) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(rooms);
			});
		});
	}

	public getChatRoomById(id: string): Promise<ChatRoomModel> {
		return new Promise((resolve, reject) => {
			this.ChatRoom.findById(id).exec((error, room: ChatRoomModel) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(room);
			});
		});
	}

	public getChatsByRoomId(roomId: string): Promise<ChatModel[]> {
		return new Promise((resolve, reject) => {
			this.Chat.find({chatRoomId: roomId})
					.sort(({timestamp: 'desc'}))
					.limit(50)
					.exec((error, chats: ChatModel[]) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(chats);
			});
		});
	}

	public getChatByRoomIdAndTimestamp(roomId: string, timestamp: number): Promise<ChatModel> {
		return new Promise((resolve, reject) => {
			this.Chat.findOne({chatRoomId: roomId, timestamp: timestamp})
					.exec((error, chat: ChatModel) => {
						if (error) {
							reject(error);
							return;
						}

						resolve(chat);
					});
		});
	}

	public getRoomOfUsers(userIds: string[]): Promise<ChatRoomModel> {
		return new Promise((resolve, reject) => {
			this.ChatRoom.findOne({
				userIds: { $all: userIds}
			})
					.where('userIds')
					.size(userIds.length)
					.exec((error, room: ChatRoomModel) => {
						if (error) {
							reject(error);
							return;
						}

						resolve(room);
					});
		});
	}
}