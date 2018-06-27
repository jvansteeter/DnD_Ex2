import { Injectable } from '@angular/core';
import { StompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';

@Injectable()
export class MqService {
	constructor(private stompService: StompService) {

	}
}