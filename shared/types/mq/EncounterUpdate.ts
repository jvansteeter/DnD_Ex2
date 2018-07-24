import { MqMessage } from './MqMessage';
import { MqMessageType } from './message-type.enum';
import { EncounterCommand } from '../encounter/encounter-command.enum';

export interface EncounterUpdate extends MqMessage {
	headers: {
		type: MqMessageType.ENCOUNTER,
		encounterId: string,
	}
	body: {
		userId: string,
		version: number,
		dataType: EncounterCommand
		data: {}
	}
}