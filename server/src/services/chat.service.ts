import { ChatRepository } from '../db/repositories/chat.repository';
import { Chat } from '../mq/messages/chat.message';
import { ChatRoomModel } from '../db/models/chat-room.model';
import { ChatType } from '../../../shared/types/mq/chat-type.enum';
import { ChatModel } from '../db/models/chat.model';
import { MqMessageType } from '../../../shared/types/mq/message-type.enum';
import { ChatMessage } from '../../../shared/types/mq/chat';
import { ChatRoomData } from '../../../shared/types/mq/chat-room.data';
import { MqServiceSingleton } from '../mq/mq.service';
import { UserModel } from '../db/models/user.model';
import { UserRepository } from '../db/repositories/user.repository';

export class ChatService {
	public static readonly SYSTEM = 'SYSTEM';

	private chatRepo: ChatRepository;
	private userRepo: UserRepository;

	constructor() {
		this.chatRepo = new ChatRepository();
		this.userRepo = new UserRepository();
	}

	public async handleChat(chat: Chat): Promise<void> {
		let room: ChatRoomModel = await this.chatRepo.getChatRoomById(chat.headers.chatRoomId);
		const existingChat = await this.chatRepo.getChatByRoomIdAndTimestamp(room._id, chat.headers.timestamp);
		if (!existingChat) {
			room.snapTimestamp();
			this.chatRepo.createChat(chat);
		}
		return;
	}

	public async createChatRoom(userId: string, type: ChatType): Promise<ChatRoomModel> {
		const room: ChatRoomModel = await this.chatRepo.createChatRoom(userId, type);
		return room.addUserId(userId);
	}

	public async getAllChatRooms(userId: string): Promise<ChatRoomData[]> {
		const chatRooms: ChatRoomData[] = JSON.parse(JSON.stringify(await this.chatRepo.getAllChatRooms(userId)));
		for (let room of chatRooms) {
			let chats: ChatModel[] = await this.chatRepo.getChatsByRoomId(room._id);
			room.chats = [];
			room['test'] = 'be here';
			for (let chat of chats) {
				room.chats.push({
					headers: {
						type: MqMessageType.CHAT,
						chatType: chat.chatType,
						fromUserId: chat.fromUserId,
						timestamp: chat.timestamp,
						chatRoomId: chat.chatRoomId,
					},
					body: chat.body
				} as ChatMessage);
			}
		}

		return chatRooms;
	}

	public async addUserToRoom(authorizingId: string, inviteeId: string, roomId: string): Promise<ChatRoomModel> {
		let room: ChatRoomModel = await this.chatRepo.getChatRoomById(roomId);
		if (room.creatorId != authorizingId && room.userIds.indexOf(authorizingId) > -1) {
			throw new Error('Not Authorized');
		}
		const invitee: UserModel = await this.userRepo.findById(inviteeId);

		MqServiceSingleton.sendChat(room, invitee.username + ' added to chat');
		return await room.addUserId(inviteeId);
	}
}