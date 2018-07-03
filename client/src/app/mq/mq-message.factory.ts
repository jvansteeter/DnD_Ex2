import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';
import { MqClientConfig } from '../config/mq.config';
import { FriendRequestMessage } from './friend-request.message';

export class MqMessageFactory {
	public static createFriendRequest(toUserId: string, fromUserId: string): FriendRequestMessage {
		return new FriendRequestMessage({
			headers: {
				type: MqMessageType.FRIEND_REQUEST,
				from: fromUserId,
				to: toUserId
			},
			body: ''
		});
	}

	public static createSendFriendRequestURL(toUserId: string): string {
		return MqClientConfig.friendRequestMqUrl + 'user.' + toUserId + '.friendRequest';
	}

	public static createGetFriendRequestURL(userId: string): string {
		return MqClientConfig.friendRequestMqUrl + 'user.' + userId + '.friendRequest';
	}
}