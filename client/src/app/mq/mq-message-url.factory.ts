import { MqClientConfig } from '../config/mq.config';

export class MqMessageUrlFactory {
	public static createSendFriendRequestUrl(toUserId: string): string {
		return MqClientConfig.userExchangeUrl + toUserId + '.friendRequest';
	}

	public static createSendCampaignInviteUrl(toUserId: string): string {
		return MqClientConfig.userExchangeUrl + toUserId + '.campaignInvite';
	}

	public static createAcceptFriendRequestUrl(toUserId: string): string {
		return MqClientConfig.userExchangeUrl + toUserId + '.acceptRequest';
	}

	public static createGetUserMessagesUrl(userId: string): string {
		return MqClientConfig.userExchangeUrl + userId + '.*';
	}
}