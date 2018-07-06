import { AmqpMessage } from './AmqpMessage';
import { FriendRequest } from '../../../../shared/types/mq/FriendRequest';
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';

export class FriendRequestMessage extends AmqpMessage implements FriendRequest {
	headers: {
		type: MqMessageType.FRIEND_REQUEST;
		fromUserId: string;
		toUserId: string;
	};

	constructor(data) {
		super(data);
		this.headers.type = MqMessageType.FRIEND_REQUEST;
		this.headers.toUserId = data.properties.headers.toUserId;
		this.headers.fromUserId = data.properties.headers.fromUserId;
	}
}