import { MqMessage } from './MqMessage';
import { MqMessageType } from './message-type.enum';

export interface CampaignInvite extends MqMessage {
	headers: {
		type: MqMessageType.CAMPAIGN_INVITE;
		campaignId: string;
		toUserId: string;
	};
}
