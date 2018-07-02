import { MqMessage } from '../../../../shared/types/mq/MqMessage';
import { Message } from '@stomp/stompjs';
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';

export class WsMessage implements MqMessage {
	properties: { type: MqMessageType };
	body: string | Object;

	constructor(message: Message) {
		let type: MqMessageType;
		switch (message.headers.type.toUpperCase()) {
			case 'ENCOUNTER': {
				type = MqMessageType.ENCOUNTER;
				break;
			}
		}

		this.properties = {
			type: type
		};

		this.body = message.body;
	}
}
