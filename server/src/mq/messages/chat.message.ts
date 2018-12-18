import { AmqpMessage } from './AmqpMessage';
import { ChatMessage } from '../../../../shared/types/mq/chat';
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';
import { ChatType } from '../../../../shared/types/mq/chat-type.enum';

export class Chat extends AmqpMessage implements ChatMessage {
	headers: {
		type: MqMessageType.CHAT;
		chatType: ChatType;
		fromUserId: string;
		timestamp: number;
		chatRoomId: string
	};
	body: string;

	constructor(data) {
		super(data);
		this.headers.type = MqMessageType.CHAT;
		this.headers.chatType = data.properties.headers.chatType;
		this.headers.fromUserId = data.properties.headers.fromUserId;
		this.headers.timestamp = data.properties.timestamp;
		this.headers.chatRoomId = data.properties.headers.chatRoomId;
	}
}