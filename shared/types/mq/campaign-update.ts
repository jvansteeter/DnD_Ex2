import { MqMessage } from "./MqMessage";
import { MqMessageType } from "./message-type.enum";

export interface CampaignUpdate extends MqMessage {
	headers: {
		type: MqMessageType.CAMPAIGN_UPDATE
	}
}
