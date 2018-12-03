import { ChatMessage } from '../../../../../shared/types/mq/chat';
import { MqMessageType } from '../../../../../shared/types/mq/message-type.enum';
import { ChatType } from '../../../../../shared/types/mq/chat-type.enum';
import { StompMessage } from './stomp-message';

export class Chat extends StompMessage implements ChatMessage {
	headers: {
		type: MqMessageType.CHAT;
		chatType: ChatType;
		fromUserId: string;
		userIds?: string[];
	};
	body: string;

	constructor(message) {
		super(message);
		this.headers.chatType = message.headers.chatType;
		this.headers.fromUserId = message.headers.fromUserId;
		this.headers.userIds = message.headers.userIds;
	}

	serializeBody(): string {
		return this.body;
	}
}