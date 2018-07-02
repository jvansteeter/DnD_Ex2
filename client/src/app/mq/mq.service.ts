import { Injectable } from '@angular/core';
import { StompRService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { UserProfileService } from '../data-services/userProfile.service';
import { StompConfiguration } from './StompConfig';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WsMessage } from './WsMessage';

@Injectable()
export class MqService {
	private encounterMqUrl: string = '/exchange/encounterExchange/encounter.';
	constructor(private stompService: StompRService,
	            private userProfileService: UserProfileService) {
		let stompConfig = StompConfiguration;
		stompConfig.headers.login = userProfileService.userId;
		stompConfig.headers.passcode = this.userProfileService.passwordHash;
		this.stompService.config = stompConfig;
		this.stompService.initAndConnect();
	}

	public getEncounterMessages(encounterId: string): Observable<WsMessage> {
		return this.stompService.subscribe(this.encounterMqUrl + encounterId)
				.pipe(
						map((message: Message) => {return new WsMessage(message)})
				);
	}
}