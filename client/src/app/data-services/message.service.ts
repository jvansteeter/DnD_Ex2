import { IsReadyService } from '../utilities/services/isReady.service';
import { MqService } from '../mq/mq.service';
import { Injectable } from '@angular/core';

@Injectable()
export class MessageService extends IsReadyService {
	constructor(private mqService: MqService) {
		super(mqService);
	}

	init(): void {
		this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady) {
				this.setReady(true);
			}
		});
	}

	public unInit(): void {
		super.unInit();
	}
}