import { Injectable } from '@angular/core';
import { StompRService, StompState } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { UserProfileService } from '../data-services/userProfile.service';
import { StompConfiguration } from './StompConfig';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MqClientConfig } from '../config/mq.config';
import { EncounterUpdateMessage } from './encounter-update.message';
import { FriendRequest } from '../../../../shared/types/mq/FriendRequest';
import { MqMessageFactory } from './mq-message.factory';
import { timer } from "rxjs/internal/observable/timer";
import { IsReadyService } from "../utilities/services/isReady.service";

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
				console.log(stompConfig);
				console.log(this.userProfileService.userId);
				console.log(this.userProfileService.passwordHash);
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
		let echo = () => {
			console.log('publishing to encounter')
			this.stompService.publish(this.encounterMqUrl + encounterId, 'encounter echo', {type: 'encounter'});
			timer(2000).subscribe(() => {
				echo();
			})
		};
		echo();
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
		this.stompService.publish(MqMessageFactory.createSendFriendRequestURL(toUserId), String(friendRequest.body));
		let echo = () => {
			console.log('publishing')
			this.stompService.publish('/exchange/userExchange/any.any', 'user secho');
			timer(2000).subscribe(() => echo());
		};
		echo();
	}
}