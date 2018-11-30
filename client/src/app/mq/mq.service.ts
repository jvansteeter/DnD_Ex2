import { Injectable } from '@angular/core';
import { StompRService, StompState } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { UserProfileService } from '../data-services/userProfile.service';
import { StompConfiguration } from './StompConfig';
import { Observable } from 'rxjs';
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

@Injectable()
export class MqService extends IsReadyService {
	private stompState: StompState = StompState.CLOSED;
	private userQueue: Observable<StompMessage>;

	constructor(private stompService: StompRService,
	            private userProfileService: UserProfileService) {
		super(userProfileService);
		this.init();
	}

	public init(): void {
		this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady && !this.isReady()) {
				let stompConfig = StompConfiguration;
				stompConfig.headers.login = this.userProfileService.userId;
				stompConfig.headers.passcode = this.userProfileService.passwordHash;
				this.stompService.config = stompConfig;
				this.stompService.connectObservable.subscribe((state: StompState) => {
					if (this.stompState !== state) {
						this.stompState = state;
						if (state === StompState.CONNECTED) {
							this.connectToUserQueue();
							this.setReady(true);
						}
						else {
							this.setReady(false);
						}
					}
				});
				this.stompService.initAndConnect();
			}
		});
	}

	public getEncounterMessages(encounterId: string): Observable<EncounterCommandMessage> {
		return this.stompService.subscribe(MqMessageUrlFactory.createEncounterMessagesUrl(encounterId))
				.pipe(
						map((message: Message) => {return new EncounterCommandMessage(message)})
				);
	}

	public publishEncounterCommand(encounterId: string, encounterVersion: number, dataType: EncounterCommandType, data: any): void {
		let message = MqMessageFactory.createEncounterUpdate(encounterVersion, this.userProfileService.userId, encounterId, dataType, data);
		let url = MqMessageUrlFactory.createEncounterMessagesUrl(encounterId);
		this.stompService.publish(url, message.serializeBody(), {type: MqMessageType.ENCOUNTER})
	}

	public sendFriendRequest(toUserId: string): void {
		let message = MqMessageFactory.createFriendRequest(toUserId, this.userProfileService.userId);
		let url = MqMessageUrlFactory.createSendFriendRequestUrl(message.headers.toUserId);
		this.stompService.publish(url, message.serializeBody(), message.headers);
	}

	public sendAcceptFriendRequestMessage(fromUserId: string): void {
		let message = MqMessageFactory.createAcceptFriendRequestMessage(fromUserId);
		let url = MqMessageUrlFactory.createAcceptFriendRequestUrl(fromUserId);
		this.stompService.publish(url, message.serializeBody(), message.headers);
	}

	public sendCampaignInvite(toUserId: string, campaignId: string): void {
		let message = MqMessageFactory.createCampaignInvite(toUserId, campaignId);
		let url = MqMessageUrlFactory.createSendCampaignInviteUrl(message.headers.toUserId);
		this.stompService.publish(url, message.serializeBody(), message.headers);
	}

	public sendCampaignUpdate(campaignId: string): void {
		let url = MqMessageUrlFactory.createCampaignMessagesUrl(campaignId);
		this.stompService.publish(url, '', {type: MqMessageType.CAMPAIGN_UPDATE});
	}

	public getIncomingUserMessages(): Observable<StompMessage> {
		return this.userQueue;
	}

	public sendChat(url: string, message: string, headers: Object): void {
		this.stompService.publish(url, message, headers);
	}

	private connectToUserQueue(): void {
		this.userQueue = this.stompService.subscribe(MqMessageUrlFactory.createGetUserMessagesUrl(this.userProfileService.userId))
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
								default: {
									console.error('Message Type not recognized');
									console.error(message);
								}
							}
						})
				);
	}

	public getIncomingCampaignMessages(campaignId: string): Observable<StompMessage> {
		return this.stompService.subscribe(MqMessageUrlFactory.createCampaignMessagesUrl(campaignId))
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