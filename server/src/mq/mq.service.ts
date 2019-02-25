import { MqProxy, MqProxySingleton } from './mqProxy';
import { UserModel } from '../db/models/user.model';
import { FriendRequest } from '../../../shared/types/mq/FriendRequest';
import { NotificationRepository } from '../db/repositories/notification.repository';
import { NotificationType } from '../../../shared/types/notifications/notification-type.enum';
import { NotificationModel } from '../db/models/notification.model';
import { CampaignInvite } from '../../../shared/types/mq/campaign-invite';
import { CampaignInviteNotification } from '../../../shared/types/notifications/campaign-invite-notification';
import { FriendRequestNotification } from "../../../shared/types/notifications/friend-request-notification";
import { FriendRepository } from "../db/repositories/friend.repository";
import { EncounterCommandType } from '../../../shared/types/encounter/encounter-command.enum';
import { PlayerRepository } from '../db/repositories/player.repository';
import { PlayerData } from '../../../shared/types/encounter/player.data';
import { MqMessageType } from '../../../shared/types/mq/message-type.enum';
import { EncounterCommandMessage } from './messages/encounter-command.message';
import { EncounterService } from '../services/encounter.service';
import { NotationRepository } from '../db/repositories/notation.repository';
import { NotationData } from '../../../shared/types/encounter/board/notation.data';
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

	public handleMessages(): void {
		this.mqProxy.observeAllEncounters().subscribe((message: EncounterCommandMessage) => {
			this.handleEncounterCommand(message);
		});
		this.mqProxy.observeAllFriendRequests().subscribe((friendRequest: FriendRequest) => {
			this.handleFriendRequest(friendRequest);
		});
		this.mqProxy.observeAllCampaignInvites().subscribe((campaignInvite: CampaignInvite) => {
			this.handleCampaignInvite(campaignInvite);
		});
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

	private async handleEncounterCommand(command: EncounterCommandMessage): Promise<void> {
		try {
			const version = await this.encounterService.getVersion(command.headers.encounterId);
			// if (command.body.version === version + 1) {  // currently versioning is causing more problems than it fixes
			if (true) {
				const encounterId = command.headers.encounterId;
				switch (command.body.dataType) {
					case EncounterCommandType.PLAYER_UPDATE: {
						this.playerRepository.updatePlayer(command.body.data as PlayerData);
						break;
					}
					case EncounterCommandType.ADD_PLAYER: {
						// do nothing, the server issues these ones
						break;
					}
					case EncounterCommandType.REMOVE_PLAYER: {
						// do nothing, the server issues these commands
						break;
					}
					case EncounterCommandType.LIGHT_SOURCE: {
						this.encounterService.setLightSources(encounterId, JSON.parse(command.body.data));
						break;
					}
					case EncounterCommandType.ADD_NOTATION: {
						// do nothing, the server issues these commands
						break;
					}
					case EncounterCommandType.NOTATION_UPDATE: {
						if (command.body.data) {
							this.notationRepo.updateNotation(JSON.parse(command.body.data) as NotationData);
						}
						break;
					}
					case EncounterCommandType.REMOVE_NOTATION: {
						// do nothing, ther server issues these commands
						break;
					}
					case EncounterCommandType.EPHEMERAL_NOTATION: {
						// do nothing, these are only peer to peer
						break;
					}
					case EncounterCommandType.WALL_CHANGE: {
						const data = command.body.data;
						this.encounterService.setWallData(encounterId, data);
						break;
					}
					case EncounterCommandType.DOOR_CHANGE: {
						const data = command.body.data;
						this.encounterService.setDoorData(encounterId, data);
						break;
					}
					case EncounterCommandType.WINDOW_CHANGE: {
						const data = command.body.data;
						this.encounterService.setWindowData(encounterId, data);
						break;
					}
					case EncounterCommandType.SETTINGS_CHANGE: {
						const data = command.body.data;
						this.encounterService.setEncounterConfig(encounterId, data);
						break;
					}
					case EncounterCommandType.TEAMS_CHANGE: {
						const data = command.body.data;
						this.encounterService.setEncounterTeamsData(encounterId, data);
						break;
					}
					case EncounterCommandType.INCREMENT_ROUND: {
						// do nothing
						// TODO: Refactor this part of code so the server doesn't listen to rabbit messages at all
						break;
					}
					default: {
						console.error('Unrecognized Command Type')
					}
				}
				this.encounterService.incrementVersion(command.headers.encounterId);
			}
		} catch (error) {
			console.error(error);
		}
	}

	private async handleFriendRequest(friendRequest: FriendRequest): Promise<void> {
		let toUserId = friendRequest.headers.toUserId;
		let fromUserId = friendRequest.headers.fromUserId;
		try {
			let pendingRequests: NotificationModel[] = await this.notificationRepo.findAllToByType(toUserId, NotificationType.FRIEND_REQUEST);
			for (let request of pendingRequests) {
				if ((request.body as FriendRequestNotification).fromUserId && (request.body as FriendRequestNotification).fromUserId === fromUserId) {
					return;
				}
			}
			let usersAreFriends: boolean = await this.friendRepo.usersAreFriends(toUserId, fromUserId);
			if (usersAreFriends) {
				return;
			}
			await this.notificationRepo.create(toUserId, NotificationType.FRIEND_REQUEST, {
				type: NotificationType.FRIEND_REQUEST,
				toUserId: toUserId,
				fromUserId: fromUserId,
			} as FriendRequestNotification);
		} catch (error) {
			console.error(error);
		}
	}

	private async handleCampaignInvite(campaignInvite: CampaignInvite): Promise<void> {
		let campaignId = campaignInvite.headers.campaignId;
		let toUserId = campaignInvite.headers.toUserId;
		try {
			let pendingNotifications: NotificationModel[] = await this.notificationRepo.findAllToByType(toUserId, NotificationType.CAMPAIGN_INVITE);
			for (let invite of pendingNotifications) {
				let campaignInvite: CampaignInviteNotification = invite.body as CampaignInviteNotification;
				if (campaignInvite.campaignId && campaignInvite.campaignId === campaignId) {
					return;
				}
			}
			await this.notificationRepo.create(toUserId, NotificationType.CAMPAIGN_INVITE, {
				type: NotificationType.CAMPAIGN_INVITE,
				campaignId: campaignId
			} as CampaignInviteNotification);
			return;
		} catch (error) {
			console.error(error);
		}
	}
}

export const MqServiceSingleton: MqService = new MqService(MqProxySingleton);