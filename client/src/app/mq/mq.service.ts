import { Injectable } from '@angular/core';
import { StompRService, StompState } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { UserProfileService } from '../data-services/userProfile.service';
import { StompConfiguration } from './StompConfig';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MqClientConfig } from '../config/mq.config';
import { EncounterUpdateMessage } from './encounter-update.message';
import { MqMessageFactory } from './mq-message.factory';
import { IsReadyService } from "../utilities/services/isReady.service";
import { StompMessage } from './stompMessage';
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';
import { FriendRequestMessage } from './friend-request.message';

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
		let friendRequest: FriendRequestMessage = MqMessageFactory.createFriendRequest(toUserId, this.userProfileService.userId);
		this.publishMessage(friendRequest);
	}

	public getIncomingFriendRequests(): Observable<FriendRequestMessage> {
		return this.stompService.subscribe(MqMessageFactory.createGetFriendRequestURL(this.userProfileService.userId))
				.pipe(
						map((message: Message) => {
							return new FriendRequestMessage(message);
						})
				);
	}

	private publishMessage(message: StompMessage) {
		let url = '';
		switch (message.headers.type) {
			case MqMessageType.FRIEND_REQUEST: {
				url = MqMessageFactory.createSendFriendRequestURL((message as FriendRequestMessage).headers.toUserId);
				break;
			}
		}

		this.stompService.publish(url, message.serializeBody(), message.headers);
	}
}