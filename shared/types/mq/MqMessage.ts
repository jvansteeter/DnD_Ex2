import { MqMessageType } from './message-type.enum';

export interface MqMessage {
	headers: {
		type: MqMessageType
	};
	body?: string | Object;
}