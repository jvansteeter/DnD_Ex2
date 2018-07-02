import { MqMessage } from '../../../shared/types/mq/MqMessage';
import { MqMessageType } from '../../../shared/types/mq/message-type.enum';

export class AmqpMessage implements MqMessage {
	properties: { type: MqMessageType };
	body: string | Object;

	constructor(data) {
		this.properties = data['properties'];
		this.body = data.content.toString();
	}
}