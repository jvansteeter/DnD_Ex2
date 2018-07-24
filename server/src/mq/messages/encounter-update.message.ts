import { AmqpMessage } from './AmqpMessage';
import { MqConfig } from '../../config/mqConfig';
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';
import { EncounterUpdate } from '../../../../shared/types/mq/EncounterUpdate';
import { EncounterCommand } from '../../../../shared/types/encounter/encounter-command.enum';

export class EncounterUpdateMessage extends AmqpMessage implements EncounterUpdate {
	headers: {
		type: MqMessageType.ENCOUNTER,
		encounterId: string,
	};
	body: {
		userId: string;
		version: number;
		dataType: EncounterCommand;
		data: {}
	};

	constructor(data) {
		super(data);
		this.headers.encounterId = data.fields.routingKey.replace(MqConfig.encounterTopic.replace('*', ''), '');
		this.body = JSON.parse(data.content.toString());
	}
}