import { AmqpMessage } from './AmqpMessage';
import { MqConfig } from '../config/mqConfig';
import { MqMessageType } from '../../../shared/types/mq/message-type.enum';
import { EncounterUpdate } from '../../../shared/types/mq/EncounterUpdate';

export class EncounterUpdateMessage extends AmqpMessage implements EncounterUpdate {
	headers: {
		type: MqMessageType.ENCOUNTER,
		encounterId: string,
	};

	constructor(data) {
		super(data);
		this.headers.encounterId = data.fields.routingKey.replace(MqConfig.encounterTopic.replace('*', ''), '');
	}
}