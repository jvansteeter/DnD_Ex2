import { MqProxy, MqProxySingleton } from './mqProxy';
import { UserModel } from '../db/models/user.model';
import { EncounterMessage } from './EncounterMessage';

export class MqService {
	constructor(private mqProxy: MqProxy) {

	}

	public handleMessages(): void {
		this.mqProxy.ObserveAllEncounters().subscribe((message: EncounterMessage) => {
			// console.log(message)
			// console.log('Properties:', message.properties)
			console.log(message)
		});
	}

	public createMqAccount(user: UserModel): Promise<void> {
		return this.mqProxy.createMqAccount(user);
	}
}

export const MqServiceSingleton: MqService = new MqService(MqProxySingleton);