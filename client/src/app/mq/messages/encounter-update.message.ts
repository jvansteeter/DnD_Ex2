import { EncounterUpdate } from '../../../../../shared/types/mq/EncounterUpdate';
import { MqMessageType } from '../../../../../shared/types/mq/message-type.enum';
import { StompMessage } from './stomp-message';

export class EncounterUpdateMessage extends StompMessage implements EncounterUpdate {
	headers: {
		type: MqMessageType.ENCOUNTER;
		encounterId: string
	};

	constructor(message) {
		super(message);
		this.headers.encounterId = message.headers.encounterId;
	}

	serializeBody(): string {
		return JSON.stringify(this.body);
	}
}