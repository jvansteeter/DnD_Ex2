import { AmqpMessage } from './AmqpMessage';
import { MqConfig } from '../config/mqConfig';
import { MqMessageType } from '../../../shared/types/mq/message-type.enum';

export class EncounterMessage extends AmqpMessage {
	properties: {
		type: MqMessageType.ENCOUNTER,
		encounterId: String
	};

	constructor(data) {
		super(data);
		this.properties.encounterId = data.fields.routingKey.replace(MqConfig.encounterTopic.replace('*', ''), '');
	}
}