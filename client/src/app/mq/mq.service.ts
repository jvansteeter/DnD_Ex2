import { Injectable } from '@angular/core';
import { StompRService, StompState } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { UserProfileService } from '../data-services/userProfile.service';
import { StompConfiguration } from './StompConfig';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MqClientConfig } from '../config/mq.config';
import { EncounterUpdateMessage } from './messages/encounter-update.message';
import { MqMessageFactory } from './mq-message.factory';
import { IsReadyService } from "../utilities/services/isReady.service";
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';
import { FriendRequestMessage } from './messages/friend-request.message';
import { AcceptFriendRequest } from './messages/friend-request-accepted.message';
import { MqMessageUrlFactory } from './mq-message-url.factory';
import { StompMessage } from './messages/stomp-message';

@Injectable()
export class MqService extends IsReadyService {
	private encounterMqUrl: string = MqClientConfig.encounterMqUrl;
	private stompState: StompState = StompState.CLOSED;

	constructor(private stompService: StompRService,
	            private userProfileService: UserProfileService) {
		super(userProfileService);
		this.init();
	}

	public init(): void {
		this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady) {
				let stompConfig = StompConfiguration;
				stompConfig.headers.login = this.userProfileService.userId;
				stompConfig.headers.passcode = this.userProfileService.passwordHash;
				this.stompService.config = stompConfig;
				this.stompService.connectObservable.subscribe((state: StompState) => {
					if (this.stompState !== state) {
						this.stompState = state;
						if (state === StompState.CONNECTED) {
							this.setReady(true);
						}
						else {
							this.setReady(false);
						}
					}
				});
				this.stompService.initAndConnect();
			}
		})
	}

	public getEncounterMessages(encounterId: string): Observable<EncounterUpdateMessage> {
		return this.stompService.subscribe(this.encounterMqUrl + encounterId)
				.pipe(
						map((message: Message) => {return new EncounterUpdateMessage(message)})
				);
	}

	public sendFriendRequest(toUserId: string): void {
		let message = MqMessageFactory.createFriendRequest(toUserId, this.userProfileService.userId);
		let url = MqMessageUrlFactory.createSendFriendRequestUrl(message.headers.toUserId);
		this.stompService.publish(url, message.serializeBody(), message.headers);
	}

	public sendAcceptFriendRequestMessage(fromUserId: string): void {
		console.log('send accept friend request message')
		let message = MqMessageFactory.createAcceptFriendRequestMessage(fromUserId);
		let url = MqMessageUrlFactory.createAcceptFriendRequestUrl(fromUserId);
		this.stompService.publish(url, message.serializeBody(), message.headers);
	}

	public sendCampaignInvite(toUserId: string, campaignId: string): void {
		let message = MqMessageFactory.createCampaignInvite(toUserId, campaignId);
		console.log(message)
		let url = MqMessageUrlFactory.createSendCampaignInviteUrl(message.headers.toUserId);
		this.stompService.publish(url, message.serializeBody(), message.headers);
	}

	public getIncomingUserMessages(): Observable<StompMessage> {
		return this.stompService.subscribe(MqMessageUrlFactory.createGetUserMessagesUrl(this.userProfileService.userId))
				.pipe(
						map((message: Message) => {
							switch (message.headers['type']) {
								case MqMessageType.FRIEND_REQUEST: {
									return new FriendRequestMessage(message);
								}
								case MqMessageType.FRIEND_REQUEST_ACCEPTED: {
									return new AcceptFriendRequest(message);
								}
								default: {
									console.error('Message Type not recognized');
									console.error(message);
								}
							}
						})
				);
	}
}