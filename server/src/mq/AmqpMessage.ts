import { MqMessage } from '../../../shared/types/mq/MqMessage';
import { MqMessageType } from '../../../shared/types/mq/message-type.enum';

export class AmqpMessage implements MqMessage {
	headers: { type: MqMessageType };
	body: string | Object;

	constructor(data) {
		this.headers = {
			type: data.properties.type
		};
		this.body = data.content.toString();
	}
}