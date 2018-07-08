import { AmqpMessage } from './AmqpMessage';
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';
import { CampaignInvite } from '../../../../shared/types/mq/campaign-invite';

export class CampaignInviteMessage extends AmqpMessage implements CampaignInvite {
	headers: {
		type: MqMessageType.CAMPAIGN_INVITE;
		campaignId: string;
		toUserId: string;
	};

	constructor(data) {
		super(data);
		console.log('\n\n---construct a Campaign Invite Message---')
		console.log(data)
		this.headers.type = MqMessageType.CAMPAIGN_INVITE;
		this.headers.campaignId = data.properties.headers.campaignId;
		this.headers.toUserId = data.properties.headers.toUserId;
	}
}