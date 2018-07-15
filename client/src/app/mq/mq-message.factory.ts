import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';
import { FriendRequestMessage } from './messages/friend-request.message';
import { AcceptFriendRequest } from './messages/friend-request-accepted.message';
import { CampaignInviteMessage } from './messages/campaign-invite.message';
import { CampaignUpdate } from "../../../../shared/types/mq/campaign-update";

export class MqMessageFactory {
	public static createFriendRequest(toUserId: string, fromUserId: string): FriendRequestMessage {
		return new FriendRequestMessage({
			headers: {
				type: MqMessageType.FRIEND_REQUEST,
				fromUserId: fromUserId,
				toUserId: toUserId
			}
		});
	}

	public static createAcceptFriendRequestMessage(toUserId): AcceptFriendRequest {
		return new AcceptFriendRequest({
			headers: {
				type: MqMessageType.FRIEND_REQUEST_ACCEPTED,
				toUserId: toUserId
			}
		});
	}

	public static createCampaignInvite(toUserId: string, campaignId: string): CampaignInviteMessage {
		return new CampaignInviteMessage({
			headers: {
				type: MqMessageType.CAMPAIGN_INVITE,
				toUserId: toUserId,
				campaignId: campaignId
			}
		});
	}
}