import { Injectable } from '@angular/core';
import { EncounterService } from './encounter.service';
import { IsReadyService } from '../utilities/services/isReady.service';
import { StompMessage } from '../mq/messages/stomp-message';
import { MqService } from '../mq/mq.service';

@Injectable()
export class EncounterConcurrencyService extends IsReadyService {
	constructor(private encounterService: EncounterService,
	            private mqService: MqService) {
		super(encounterService, mqService);
	}

	init(): void {
		this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady) {
				this.observeEncounterMqMessages();
				this.observePlayerChanges();
				this.setReady(true);
			}
		});
	}

	private observeEncounterMqMessages(): void {
		this.mqService.getEncounterMessages(this.encounterService.encounterState._id).subscribe((message: StompMessage) => {
			this.handleWsMessage(message);
		});
	}

	private observePlayerChanges(): void {
		for (let player of this.encounterService.players) {
			player.changeObservable.subscribe(() => {
				this.mqService.publishEncounterUpdate(this.encounterService.encounterState._id, player.serialize());
				console.log('player changed')
			});
		}
	}

	private handleWsMessage(message: StompMessage) {
		console.log('get encounter message')
		console.log(JSON.stringify(message.body))
	}
}