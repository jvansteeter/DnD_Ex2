import { StompMessage } from './stompMessage';
import { FriendRequest } from '../../../../shared/types/mq/FriendRequest';
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';

export class FriendRequestMessage extends StompMessage implements FriendRequest {
	headers: {
		type: MqMessageType.FRIEND_REQUEST;
		from: string;
		to: string;
	};

	constructor(message) {
		super(message);
		this.headers.type = MqMessageType.FRIEND_REQUEST;
		this.headers.to = message.headers.to;
		this.headers.from = message.headers.from;
	}

	public serializeBody(): string {
		return '';
	}
}