import { MqProxy, MqProxySingleton } from './mqProxy';
import { UserModel } from '../db/models/user.model';
import { EncounterUpdateMessage } from './encounter-update.message';
import { FriendRequest } from '../../../shared/types/mq/FriendRequest';

export class MqService {
	constructor(private mqProxy: MqProxy) {

	}

	public handleMessages(): void {
		this.mqProxy.observeAllEncounters().subscribe((message: EncounterUpdateMessage) => {
			// console.log(message)
			// console.log('Properties:', message.properties)
			console.log(message)
		});
		console.log('---- Observe all friend requests ----')
		this.mqProxy.observeAllFriendRequests().subscribe((friendRequest: FriendRequest) => {
			console.log('---- Friend Request ----')
			console.log(friendRequest)
		});
	}

	public createMqAccount(user: UserModel): Promise<void> {
		return this.mqProxy.createMqAccount(user);
	}

	public userHasMqAccount(user: UserModel): Promise<boolean> {
		return this.mqProxy.userHasMqAccount(user);
	}
}

export const MqServiceSingleton: MqService = new MqService(MqProxySingleton);