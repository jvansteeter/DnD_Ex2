import { AmqpMessage } from './AmqpMessage';
import { FriendRequest } from '../../../shared/types/mq/FriendRequest';
import { MqMessageType } from '../../../shared/types/mq/message-type.enum';

export class FriendRequestMessage extends AmqpMessage implements FriendRequest {
	headers: {
		type: MqMessageType.FRIEND_REQUEST;
		from: string;
		to: string;
	};

	constructor(data) {
		super(data);
		this.headers.to = data.properties.headers.to;
		this.headers.from = data.properties.headers.from;
	}
}