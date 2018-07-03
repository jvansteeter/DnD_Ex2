import { MqMessage } from '../../../../shared/types/mq/MqMessage';
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';

export abstract class StompMessage implements MqMessage {
	headers: { type: MqMessageType };
	body: string | Object;

	protected constructor(message) {
		let type: MqMessageType;
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

	public abstract serializeBody(): string;
}
