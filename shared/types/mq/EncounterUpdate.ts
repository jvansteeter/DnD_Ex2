import { MqMessage } from './MqMessage';
import { MqMessageType } from './message-type.enum';

export interface EncounterUpdate extends MqMessage {
	headers: {
		type: MqMessageType.ENCOUNTER,
		encounterId: string,
	}
}