import { Injectable } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { RxStompState } from '@stomp/rx-stomp';
import { Message } from '@stomp/stompjs';
import { UserProfileService } from '../data-services/userProfile.service';
import { StompConfiguration } from './StompConfig';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MqMessageFactory } from './mq-message.factory';
import { IsReadyService } from "../utilities/services/isReady.service";
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';
import { FriendRequestMessage } from './messages/friend-request.message';
import { AcceptFriendRequest } from './messages/friend-request-accepted.message';
import { MqMessageUrlFactory } from './mq-message-url.factory';
import { StompMessage } from './messages/stomp-message';
import { CampaignInviteMessage } from './messages/campaign-invite.message';
import { EncounterCommandType } from '../../../../shared/types/encounter/encounter-command.enum';
import { EncounterCommandMessage } from './messages/encounter-command.message';
import { Chat } from './messages/chat.message';
import { ChatType } from '../../../../shared/types/mq/chat-type.enum';
import { ChatRoom } from '../chat/chat-room';

@Injectable()
export class MqService extends IsReadyService {
	private stompState: RxStompState = RxStompState.CLOSED;
	private userQueue: Observable<StompMessage>;
	private stompStateSub: Subscription;

	constructor(private stompService: RxStompService,
	            private userProfileService: UserProfileService) {
		super(userProfileService);
		this.init();
	}

	public init(): void {
		this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady && !this.isReady()) {
				let stompConfig = StompConfiguration;
				stompConfig.connectHeaders.login = this.userProfileService.userId;
				stompConfig.connectHeaders.passcode = this.userProfileService.passwordHash;
				this.stompService.configure(stompConfig);
				this.stompStateSub = this.stompService.connectionState$.subscribe((state: RxStompState) => {
					console.log('State change:', state)
					if (this.stompState !== state) {
						this.stompState = state;
						if (state === RxStompState.OPEN) {
							this.connectToUserQueue();
							this.setReady(true);
						}
						else if (state === RxStompState.CLOSED) {
							this.stompService.deactivate();
							setTimeout(() => {
								this.stompService.activate();
							});
						}
					}
				});
				this.stompService.activate();
			}
		});
	}

	public getEncounterMessages(encounterId: string): Observable<EncounterCommandMessage> {
		return this.stompService.watch(MqMessageUrlFactory.createEncounterMessagesUrl(encounterId))
				.pipe(
						map((message: Message) => {return new EncounterCommandMessage(message)})
				);
	}

	public publishEncounterCommand(encounterId: string, encounterVersion: number, dataType: EncounterCommandType, data: any): void {
		let message = MqMessageFactory.createEncounterUpdate(encounterVersion, this.userProfileService.userId, encounterId, dataType, data);
		this.stompService.publish({
			destination: MqMessageUrlFactory.createEncounterMessagesUrl(encounterId),
			headers: {
				type: MqMessageType.ENCOUNTER
			},
			body: message.serializeBody()
		});
	}

	public sendFriendRequest(toUserId: string): void {
		let message = MqMessageFactory.createFriendRequest(toUserId, this.userProfileService.userId);
		this.stompService.publish({
			destination: MqMessageUrlFactory.createSendFriendRequestUrl(message.headers.toUserId),
			headers: message.headers,
			body: message.serializeBody()
		});
	}

	public sendAcceptFriendRequestMessage(fromUserId: string): void {
		let message = MqMessageFactory.createAcceptFriendRequestMessage(fromUserId);
		this.stompService.publish({
			destination: MqMessageUrlFactory.createAcceptFriendRequestUrl(fromUserId),
			headers: message.headers,
			body: message.serializeBody()
		});
	}

	public sendCampaignInvite(toUserId: string, campaignId: string): void {
		let message = MqMessageFactory.createCampaignInvite(toUserId, campaignId);
		this.stompService.publish({
			destination: MqMessageUrlFactory.createSendCampaignInviteUrl(message.headers.toUserId),
			headers: message.headers,
			body: message.serializeBody()
		});
	}

	public sendCampaignUpdate(campaignId: string): void {
		this.stompService.publish({
			destination: MqMessageUrlFactory.createCampaignMessagesUrl(campaignId),
			headers: {type: MqMessageType.CAMPAIGN_UPDATE}
		});
	}

	public getIncomingUserMessages(): Observable<StompMessage> {
		return this.userQueue;
	}

	public sendChat(chat: Chat, room: ChatRoom): void {
		switch (chat.headers.chatType) {
			case ChatType.USER: {
				let url: string;
				for (let toUser of room.userIds) {
					url = MqMessageUrlFactory.createUserChatUrl(toUser);
					this.stompService.publish({
						destination: MqMessageUrlFactory.createUserChatUrl(toUser),
						headers: chat.headers as any,
						body: chat.body
					})
				}
				break;
			}
		}
	}

	private connectToUserQueue(): void {
		this.userQueue = this.stompService.watch(MqMessageUrlFactory.createGetUserMessagesUrl(this.userProfileService.userId))
				.pipe(
						map((message: Message) => {
							console.log('user message:', message)
							switch (message.headers['type']) {
								case MqMessageType.FRIEND_REQUEST: {
									return new FriendRequestMessage(message);
								}
								case MqMessageType.FRIEND_REQUEST_ACCEPTED: {
									return new AcceptFriendRequest(message);
								}
								case MqMessageType.CAMPAIGN_INVITE: {
									return new CampaignInviteMessage(message);
								}
								case MqMessageType.CHAT: {
									return new Chat(message);
								}
								default: {
									console.error('Message Type not recognized');
									console.error(message);
								}
							}
						})
				);
	}

	public getIncomingCampaignMessages(campaignId: string): Observable<StompMessage> {
		return this.stompService.watch(MqMessageUrlFactory.createCampaignMessagesUrl(campaignId))
				.pipe(
						map((message: Message) => {
							return new class CampaignMessage extends StompMessage {
								constructor(data) {
									super(data);
								}

								serializeBody(): string {
									return '';
								}
							}(message);
						})
				);
	}
}