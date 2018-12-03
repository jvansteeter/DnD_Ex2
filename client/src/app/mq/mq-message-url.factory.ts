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

	public static createUserChatUrl(toUserId: string): string {
		return MqClientConfig.userExchangeUrl + toUserId + '.chat';
	}

	public static createGetUserMessagesUrl(userId: string): string {
		return MqClientConfig.userExchangeUrl + userId + '.*';
	}

	public static createCampaignMessagesUrl(campaignId: string): string {
		return MqClientConfig.campaignExchangeUrl + campaignId;
	}

	public static createEncounterMessagesUrl(encounterId: string): string {
		return MqClientConfig.encounterMqUrl + encounterId;
	}
}