import { MqMessageType } from './message-type.enum';

export interface MqMessage {
	properties: {
		type: MqMessageType
	};
	body: string | Object;
}