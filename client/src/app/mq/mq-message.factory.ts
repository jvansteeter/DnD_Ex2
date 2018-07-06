import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';
import { MqClientConfig } from '../config/mq.config';
import { FriendRequestMessage } from './friend-request.message';
import { StompMessage } from './stompMessage';
import { AcceptFriendRequest } from './friend-request-accepted.message';

export class MqMessageFactory {
	public static createFriendRequest(toUserId: string, fromUserId: string): FriendRequestMessage {
		return new FriendRequestMessage({
			headers: {
				type: MqMessageType.FRIEND_REQUEST,
				fromUserId: fromUserId,
				toUserId: toUserId
			},
			body: ''
		});
	}

	public static createAcceptFriendRequestMessage(toUserId): StompMessage {
		return new AcceptFriendRequest({
			headers: {
				type: MqMessageType.FRIEND_REQUEST_ACCEPTED,
				toUserId: toUserId
			},
			body: ''
		});
	}

	public static createSendFriendRequestUrl(toUserId: string): string {
		return MqClientConfig.userExchangeUrl + toUserId + '.friendRequest';
	}

	public static createGetFriendRequestUrl(userId: string): string {
		return MqClientConfig.userExchangeUrl + userId + '.friendRequest';
	}

	public static createAcceptFriendRequestUrl(toUserId: string): string {
		return MqClientConfig.userExchangeUrl + toUserId + '.acceptRequest';
	}

	public static createGetUserMessagesUrl(userId: string): string {
		return MqClientConfig.userExchangeUrl + userId + '.*';
	}
}