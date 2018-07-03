import { MqMessageType } from './message-type.enum';
import { MqMessage } from './MqMessage';

export interface FriendRequest extends MqMessage {
	headers: {
		type: MqMessageType.FRIEND_REQUEST,
		fromUserId: string,
		toUserId: string,
	}
}