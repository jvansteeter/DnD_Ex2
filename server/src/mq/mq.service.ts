import { MqProxy, MqProxySingleton } from './mqProxy';
import { UserModel } from '../db/models/user.model';

export class MqService {
	constructor(private mqProxy: MqProxy) {

	}

	public handleMessages(): void {
		this.mqProxy.ObserveAllEncounters().subscribe((message) => {
			// console.log(message)
			// console.log('Headers:', message.properties)
			console.log(message.content.toString())
		});
	}

	public createMqAccount(user: UserModel): Promise<void> {
		return this.mqProxy.createMqAccount(user);
	}
}

export const MqServiceSingleton: MqService = new MqService(MqProxySingleton);