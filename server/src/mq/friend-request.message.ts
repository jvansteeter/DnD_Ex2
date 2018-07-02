import { AmqpMessage } from './AmqpMessage';
import { FriendRequest } from '../../../shared/types/mq/FriendRequest';
import { MqMessageType } from '../../../shared/types/mq/message-type.enum';

export class FriendRequestMessage extends AmqpMessage implements FriendRequest {
	properties: {
		type: MqMessageType.FRIEND_REQUEST;
		from: String;
		to: String
	};

	constructor(data) {
		super(data);
	}
}