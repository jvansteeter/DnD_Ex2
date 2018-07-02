import { Injectable } from '@angular/core';
import { StompRService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { UserProfileService } from '../data-services/userProfile.service';
import { StompConfiguration } from './StompConfig';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MqClientConfig } from '../config/mq.config';
import { EncounterUpdateMessage } from './encounter-update.message';
import { FriendRequest } from '../../../../shared/types/mq/FriendRequest';
import { MqMessageFactory } from './mq-message.factory';

@Injectable()
export class MqService {
	private encounterMqUrl: string = MqClientConfig.encounterMqUrl;
	constructor(private stompService: StompRService,
	            private userProfileService: UserProfileService) {
		let stompConfig = StompConfiguration;
		stompConfig.headers.login = userProfileService.userId;
		stompConfig.headers.passcode = this.userProfileService.passwordHash;
		this.stompService.config = stompConfig;
		this.stompService.initAndConnect();
	}

	public getEncounterMessages(encounterId: string): Observable<EncounterUpdateMessage> {
		return this.stompService.subscribe(this.encounterMqUrl + encounterId)
				.pipe(
						map((message: Message) => {return new EncounterUpdateMessage(message)})
				);
	}

	public sendFriendRequest(toUserId: string): void {
		let friendRequest: FriendRequest = MqMessageFactory.createFriendRequest(toUserId, this.userProfileService.userId);
		console.log('MqService.sendFriendRequest()')
		console.log(MqMessageFactory.createSendFriendRequestURL(toUserId))
		console.log(friendRequest)
		this.stompService.publish(MqMessageFactory.createSendFriendRequestURL(toUserId), String(friendRequest.body), friendRequest.properties);
	}
}