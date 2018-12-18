import { ChatRepository } from '../db/repositories/chat.repository';
import { Chat } from '../mq/messages/chat.message';
import { ChatRoomModel } from '../db/models/chat-room.model';
import { ChatType } from '../../../shared/types/mq/chat-type.enum';
import { ChatModel } from '../db/models/chat.model';
import { MqMessageType } from '../../../shared/types/mq/message-type.enum';
import { ChatMessage } from '../../../shared/types/mq/chat';
import { ChatRoomData } from '../../../shared/types/mq/chat-room.data';

export class ChatService {
	private chatRepo: ChatRepository;

	constructor() {
		this.chatRepo = new ChatRepository();
	}

	public async handleChat(chat: Chat): Promise<void> {
		console.log('got chat:', chat)
		let room: ChatRoomModel = await this.chatRepo.getChatRoomById(chat.headers.chatRoomId);
		room.snapTimestamp();
		this.chatRepo.createChat(chat);
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
}