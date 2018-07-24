import { EncounterUpdate } from '../../../../../shared/types/mq/EncounterUpdate';
import { MqMessageType } from '../../../../../shared/types/mq/message-type.enum';
import { StompMessage } from './stomp-message';
import { EncounterCommand } from '../../../../../shared/types/encounter/encounter-command.enum';

export class EncounterUpdateMessage extends StompMessage implements EncounterUpdate {
	headers: {
		type: MqMessageType.ENCOUNTER;
		encounterId: string
	};
	body: {
		userId: string;
		version: number;
		dataType: EncounterCommand
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