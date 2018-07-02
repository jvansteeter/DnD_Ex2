import { StompMessage } from './stompMessage';

export class EncounterUpdateMessage extends StompMessage {
	constructor(data) {
		super(data);
	}
}