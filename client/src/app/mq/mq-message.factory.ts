import { FriendRequest } from '../../../../shared/types/mq/FriendRequest';
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';
import { MqClientConfig } from '../config/mq.config';

export class MqMessageFactory {
	public static createFriendRequest(toUserId: string, fromUserId: string): FriendRequest {
		return {
			properties: {
				type: MqMessageType.FRIEND_REQUEST,
				from: fromUserId,
				to: toUserId
			},
			body: ''
		}
	}

	public static createSendFriendRequestURL(toUserId: string): string {
		return MqClientConfig.friendRequestMqUrl + 'user.' + toUserId + '.friendRequest';
	}
}