import { MqProxy, MqProxySingleton } from './mqProxy';
import { UserModel } from '../db/models/user.model';
import { NotificationRepository } from '../db/repositories/notification.repository';
import { FriendRepository } from "../db/repositories/friend.repository";
import { EncounterCommandType } from '../../../shared/types/encounter/encounter-command.enum';
import { PlayerRepository } from '../db/repositories/player.repository';
import { MqMessageType } from '../../../shared/types/mq/message-type.enum';
import { EncounterService } from '../services/encounter.service';
import { NotationRepository } from '../db/repositories/notation.repository';
import { ChatService } from '../services/chat.service';
import { ChatRoomModel } from '../db/models/chat-room.model';
import { ChatMessage } from '../../../shared/types/mq/chat';

export class MqService {
	private friendRepo: FriendRepository;
	private notificationRepo: NotificationRepository;
	private playerRepository: PlayerRepository;
	private encounterService: EncounterService;
	private notationRepo: NotationRepository;
	private chatService: ChatService;

	constructor(private mqProxy: MqProxy) {
		this.friendRepo = new FriendRepository();
		this.notificationRepo = new NotificationRepository();
		this.playerRepository = new PlayerRepository();
		this.encounterService = new EncounterService();
		this.notationRepo = new NotationRepository();
		this.chatService = new ChatService();
	}

	public createMqAccount(user: UserModel): Promise<void> {
		return this.mqProxy.createMqAccount(user);
	}

	public userHasMqAccount(user: UserModel): Promise<boolean> {
		return this.mqProxy.userHasMqAccount(user);
	}

	public async sendEncounterCommand(encounterId: string, userId: string, commandType: EncounterCommandType, version: number, data: any): Promise<void> {
		try {
			await this.mqProxy.sendEncounterCommand(encounterId, {
				headers: {
					type: MqMessageType.ENCOUNTER,
					encounterId: encounterId
				},
				body: {
					userId: userId,
					version: version,
					dataType: commandType,
					data: data
				}
			});
		} catch (error) {
			throw error;
		}
	}

	public async sendChat(room: ChatRoomModel, message: string): Promise<void> {
		const chat = {
			headers: {
				type: MqMessageType.CHAT,
				chatType: room.chatType,
				fromUserId: ChatService.SYSTEM,
				timestamp: new Date().getTime(),
				chatRoomId: room._id,
			},
			body: message,
		} as ChatMessage;
		await this.chatService.saveChat(ChatService.SYSTEM, chat);
		return this.mqProxy.sendChat(room, chat);
	}
}

export const MqServiceSingleton: MqService = new MqService(MqProxySingleton);