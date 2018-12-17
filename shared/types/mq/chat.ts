import { MqMessage } from './MqMessage';
import { MqMessageType } from './message-type.enum';
import { ChatType } from './chat-type.enum';

export interface ChatMessage extends MqMessage{
	headers: {
		type: MqMessageType.CHAT,
		chatType: ChatType,
		fromUserId: string,
		userIds?: string[],
		timestamp: number,
	}
	body: string
}
