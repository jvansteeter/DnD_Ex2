import { StompMessage } from './stompMessage';
import { FriendRequest } from '../../../../shared/types/mq/FriendRequest';
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';

export class FriendRequestMessage extends StompMessage implements FriendRequest {
	headers: {
		type: MqMessageType.FRIEND_REQUEST;
		fromUserId: string;
		toUserId: string;
	};

	constructor(message) {
		super(message);
		this.headers.type = MqMessageType.FRIEND_REQUEST;
		this.headers.toUserId = message.headers.toUserId;
		this.headers.fromUserId = message.headers.fromUserId;
	}

	public serializeBody(): string {
		return '';
	}
}