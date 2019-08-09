import { ChatRepository } from '../db/repositories/chat.repository';
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

	public async saveChat(userId: string, chat: ChatMessage): Promise<void> {
		let room: ChatRoomModel = await this.chatRepo.getChatRoomById(chat.headers.chatRoomId);
		const existingChat = await this.chatRepo.getChatByRoomIdAndTimestamp(room._id, chat.headers.timestamp);
		if (!existingChat) {
			await room.markTimestamp();
			await this.chatRepo.createChat(chat);
		}
		await this.checkChatRoom(userId, room._id);
		return;
	}

	public async createChatRoom(userId: string, type: ChatType): Promise<ChatRoomModel> {
		const room: ChatRoomModel = await this.chatRepo.createChatRoom(type);
		return room.addUserId(userId);
	}

	public async getAllChatRooms(userId: string): Promise<ChatRoomData[]> {
		const chatRooms: ChatRoomData[] = JSON.parse(JSON.stringify(await this.chatRepo.getAllChatRooms(userId)));
		const assembledRooms: any[] = [];
		for (let room of chatRooms) {
			let assembledRoom = await this.assembleChatRoom(room);
			assembledRooms.push(assembledRoom);
		}

		return assembledRooms;
	}

	public async addUserToRoom(authorizingId: string, inviteeId: string, roomId: string): Promise<ChatRoomModel> {
		let room: ChatRoomModel = await this.chatRepo.getChatRoomById(roomId);
		if (room.userIds.includes(authorizingId)) {
			throw new Error('Not Authorized');
		}
		const invitee: UserModel = await this.userRepo.findById(inviteeId);

		MqServiceSingleton.sendChat(room, invitee.username + ' added to chat');
		return await room.addUserId(inviteeId);
	}

	public async getOrCreateRoomOfUsers(userId: string, userIds: string[]): Promise<ChatRoomModel> {
		if (userIds.includes(userId)) {
			throw new Error('Not in this conversation');
		}
		let room: ChatRoomModel = await this.chatRepo.getRoomOfUsers(userIds);
		if (!room) {
			room = await this.chatRepo.createChatRoom(ChatType.USER);
			for (let user of userIds) {
				room = await room.addUserId(user);
			}
		}
		room = await room.markLastChecked(userId);

		return await this.assembleChatRoom(room);
	}

	public async checkChatRoom(userId: string, roomId: string): Promise<void> {
		let room: ChatRoomModel = await this.chatRepo.getChatRoomById(roomId);
		await room.markLastChecked(userId);
		return;
	}

	private async assembleChatRoom(room: ChatRoomData): Promise<any> {
		const chatRoomData = JSON.parse(JSON.stringify(room));
		chatRoomData.chats = [];
		let chats: ChatModel[] = await this.chatRepo.getChatsByRoomId(room._id);
		for (let chat of chats) {
			chatRoomData.chats.push({
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

		return chatRoomData;
	}
}