import { MqConfig } from '../config/mqConfig';

export class MqFactory {
	public static createUserExchangeReadExp(userId: string): string {
		return MqConfig.friendRequestTopic.replace('*', userId);
	}

	public static createUserExchangeWriteExp(): string {
		return 'user.*.*';
	}
}