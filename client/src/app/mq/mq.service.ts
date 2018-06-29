import { Injectable } from '@angular/core';
import { StompRService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { UserProfileService } from '../utilities/services/userProfile.service';
import { UserProfile } from '../types/userProfile';
import { StompConfiguration } from './StompConfig';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/internal/observable/of';
import { timer } from 'rxjs/internal/observable/timer';

@Injectable()
export class MqService {
	private encounterMqUrl: string = '/exchange/encounterExchange/encounter.';
	constructor(private stompService: StompRService,
	            private userProfileService: UserProfileService) {
		this.userProfileService.getUserProfile().then((user: UserProfile) => {
			let stompConfig = StompConfiguration;
			stompConfig.headers.login = user._id;
			stompConfig.headers.passcode = this.userProfileService.getPasswordHash();
			this.stompService.config = stompConfig;
			this.stompService.initAndConnect();
		});
	}

	public getEncounterMessages(encounterId: string): Observable<any> {
		this.stompService.subscribe(this.encounterMqUrl + encounterId).subscribe((message: Message) => {
			console.log('encounter: ', encounterId)
			console.log(message);
		});
		let echo = () => {
			console.log('publishing')
			this.stompService.publish(this.encounterMqUrl + encounterId, 'echo', {type: 'encounter'});
			timer(2000).subscribe(() => echo());
		};
		// echo();
		return of({});
	}
}