import { StompMessage } from './stompMessage';
import { Message } from '@stomp/stompjs';
import { FriendRequest } from '../../../../shared/types/mq/FriendRequest';
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';

export class FriendRequestMessage extends StompMessage implements FriendRequest {
	properties: {
		type: MqMessageType.FRIEND_REQUEST;
		from: String;
		to: String;
	};

	constructor(message: Message) {
		super(message);
		this.properties.to = message.headers.to;
		this.properties.from = message.headers.from;
	}
}