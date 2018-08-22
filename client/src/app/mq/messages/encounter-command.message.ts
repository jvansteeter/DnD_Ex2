import { MqMessageType } from '../../../../../shared/types/mq/message-type.enum';
import { StompMessage } from './stomp-message';
import { EncounterCommandType } from '../../../../../shared/types/encounter/encounter-command.enum';
import { EncounterCommand } from '../../../../../shared/types/mq/encounter-command';

export class EncounterCommandMessage extends StompMessage implements EncounterCommand {
	headers: {
		type: MqMessageType.ENCOUNTER;
		encounterId: string
	};
	body: {
		userId: string;
		version: number;
		dataType: EncounterCommandType
		data: {}
	};

	constructor(message) {
		super(message);
		this.headers.encounterId = message.headers.encounterId;
		this.body = JSON.parse(message.body);
	}

	serializeBody(): string {
		return JSON.stringify(this.body);
	}
}