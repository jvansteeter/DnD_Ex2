import { AmqpMessage } from './AmqpMessage';
import { MqConfig } from '../../config/mqConfig';
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';
import { EncounterCommandType } from '../../../../shared/types/encounter/encounter-command.enum';
import { EncounterCommand } from '../../../../shared/types/mq/encounter-command';

export class EncounterCommandMessage extends AmqpMessage implements EncounterCommand {
	headers: {
		type: MqMessageType.ENCOUNTER,
		encounterId: string,
	};
	body: {
		userId: string;
		version: number;
		dataType: EncounterCommandType;
		data: any
	};

	constructor(data) {
		super(data);
		this.headers.encounterId = data.fields.routingKey.replace(MqConfig.encounterTopic.replace('*', ''), '');
		this.body = JSON.parse(data.content.toString());
	}
}