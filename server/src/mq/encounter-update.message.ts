import { AmqpMessage } from './AmqpMessage';
import { MqConfig } from '../config/mqConfig';
import { MqMessageType } from '../../../shared/types/mq/message-type.enum';

export class EncounterUpdateMessage extends AmqpMessage {
	headers: {
		type: MqMessageType.ENCOUNTER,
		encounterId: String
	};

	constructor(data) {
		super(data);
		this.headers.encounterId = data.fields.routingKey.replace(MqConfig.encounterTopic.replace('*', ''), '');
	}
}