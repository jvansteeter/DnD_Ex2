
export class MqFactory {
	public static createUserExchangeReadExp(userId: string): string {
		return 'user.' + userId + '.*';
	}

	public static createUserExchangeWriteExp(): string {
		return 'user.*.*';
	}
}