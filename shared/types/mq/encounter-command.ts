import { MqMessage } from './MqMessage';
import { MqMessageType } from './message-type.enum';
import { EncounterCommandType } from '../encounter/encounter-command.enum';

export interface EncounterCommand extends MqMessage {
	headers: {
		type: MqMessageType.ENCOUNTER,
		encounterId: string,
	}
	body: {
		userId: string,
		version: number,
		dataType: EncounterCommandType
		data: {}
	}
}