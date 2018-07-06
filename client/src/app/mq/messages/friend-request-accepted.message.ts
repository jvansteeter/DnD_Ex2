import { MqMessageType } from '../../../../../shared/types/mq/message-type.enum';
import { StompMessage } from './stomp-message';

export class AcceptFriendRequest extends StompMessage {
	headers: {
		type: MqMessageType.FRIEND_REQUEST_ACCEPTED;
		toUserId: string;
	};

	constructor(message) {
		super(message);
		this.headers.type = MqMessageType.FRIEND_REQUEST_ACCEPTED;
		this.headers.toUserId = message.headers.toUserId;
	}

	serializeBody(): string {
		return '';
	}
}