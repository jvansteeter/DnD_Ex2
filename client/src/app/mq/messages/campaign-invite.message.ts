import { StompMessage } from './stomp-message';
import { CampaignInvite } from '../../../../../shared/types/mq/campaign-invite';
import { MqMessageType } from '../../../../../shared/types/mq/message-type.enum';

export class CampaignInviteMessage extends StompMessage implements CampaignInvite {
	headers: {
		type: MqMessageType.CAMPAIGN_INVITE;
		campaignId: string;
		toUserId: string;
	};

	constructor(message) {
		super(message);
		this.headers.campaignId = message.headers.campaignId;
	}

	serializeBody(): string {
		return '';
	}
}