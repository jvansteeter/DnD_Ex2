import { MqMessage } from '../../../../../shared/types/mq/MqMessage';
import { MqMessageType } from '../../../../../shared/types/mq/message-type.enum';

export abstract class StompMessage implements MqMessage {
	headers: { type: MqMessageType };
	body: string | Object;

	protected constructor(message) {
		let type: MqMessageType;
		switch (message.headers.type.toUpperCase()) {
			case MqMessageType.ENCOUNTER: {
				type = MqMessageType.ENCOUNTER;
				break;
			}
			case MqMessageType.FRIEND_REQUEST: {
				type = MqMessageType.FRIEND_REQUEST;
				break;
			}
			case MqMessageType.FRIEND_REQUEST_ACCEPTED: {
				type = MqMessageType.FRIEND_REQUEST_ACCEPTED;
				break;
			}
			case MqMessageType.CAMPAIGN_INVITE: {
				type = MqMessageType.CAMPAIGN_INVITE;
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
