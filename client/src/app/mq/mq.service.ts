import { Injectable } from '@angular/core';
import { StompRService, StompState } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { UserProfileService } from '../utilities/services/userProfile.service';
import { UserProfile } from '../types/userProfile';
import { StompConfiguration } from './StompConfig';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
export class MqService {
	private encounterMqUrl: string = '/exchange/encounterExchange/encounter.';
	constructor(private stompService: StompRService,
	            private userProfileService: UserProfileService) {
		this.userProfileService.getUserProfile().then((user: UserProfile) => {
			let stompConfig = StompConfiguration;
			stompConfig.headers.login = user._id;
			stompConfig.headers.passcode = userProfileService.getPasswordHash();
			this.stompService.config = stompConfig;
			this.stompService.initAndConnect();
		});
	}

	public getEncounterMessages(encounterId: string): Observable<any> {
		// this.stompService.subscribe('/exchange/encounterExchange/encounter.hello').subscribe((message: Message) => {
		// 	console.log('hello queue')
		// 	console.log(message)
		// });
		// let echo = () => {
		// 	timer(2000).subscribe(() => {
		// 		console.log('publishing')
		// 		this.stompService.publish('/exchange/encounterExchange/encounter.hello', 'echo message', {header: 'test header'});
		// 		// echo();
		// 	});
		// };
		// echo();
		console.log('getEncounterMessages: ', encounterId);

		this.stompService.subscribe(this.encounterMqUrl + encounterId).subscribe((message: Message) => {
			console.log('encounter: ', encounterId)
			console.log(message);
		});
		return of({});
	}
}