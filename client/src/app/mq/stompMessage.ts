import { MqMessage } from '../../../../shared/types/mq/MqMessage';
import { Message } from '@stomp/stompjs';
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';

export abstract class StompMessage implements MqMessage {
	headers: { type: MqMessageType };
	body: string | Object;

	protected constructor(message: Message) {
		let type: MqMessageType;
		console.log(message)
		switch (message.headers.type.toUpperCase()) {
			case 'ENCOUNTER': {
				type = MqMessageType.ENCOUNTER;
				break;
			}
		}

		this.headers = {
			type: type
		};

		this.body = message.body;
	}
}
