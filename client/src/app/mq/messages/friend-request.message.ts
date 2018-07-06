import { FriendRequest } from '../../../../../shared/types/mq/FriendRequest';
import { MqMessageType } from '../../../../../shared/types/mq/message-type.enum';
import { StompMessage } from './stomp-message';

export class FriendRequestMessage extends StompMessage implements FriendRequest {
	headers: {
		type: MqMessageType.FRIEND_REQUEST;
		fromUserId: string;
		toUserId: string;
	};

	constructor(message) {
		super(message);
		this.headers.toUserId = message.headers.toUserId;
		this.headers.fromUserId = message.headers.fromUserId;
	}

	public serializeBody(): string {
		return '';
	}
}