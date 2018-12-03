import { Injectable } from '@angular/core';
import { SocialRepository } from '../social/social.repository';
import { UserProfile } from '../types/userProfile';
import { MqService } from '../mq/mq.service';
import { IsReadyService } from '../utilities/services/isReady.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MqMessageType } from '../../../../shared/types/mq/message-type.enum';
import { AcceptFriendRequest } from '../mq/messages/friend-request-accepted.message';
import { StompMessage } from '../mq/messages/stomp-message';

@Injectable()
export class FriendService extends IsReadyService {
	public friends: UserProfile[];
	private readonly friendsSubject: BehaviorSubject<UserProfile[]>;

	constructor(private socialRepo: SocialRepository,
	            private mqService: MqService) {
		super(mqService);
		this.friends = [];
		this.friendsSubject = new BehaviorSubject<UserProfile[]>([]);
		this.init();
	}

	public init(): void {
		this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady && !this.isReady()) {
				this.updateFriendList();
				this.handleAcceptFriendRequestMessages();
				this.setReady(true);
			}
			else {
				this.setReady(false);
			}
		});
	}

	public sendFriendRequest(toUserId: string): void {
		this.mqService.sendFriendRequest(toUserId);
	}

	public acceptRequest(fromUserId: string): void {
		this.socialRepo.acceptRequest(fromUserId).subscribe(() => {
			this.updateFriendList();
			this.mqService.sendAcceptFriendRequestMessage(fromUserId);
		});
	}

	public getFriendsSubject(): Subject<UserProfile[]> {
		return this.friendsSubject;
	}

	public getFriendByUserName(username: string): UserProfile {
		for (let friend of this.friends) {
			if (friend.username === username) {
				return friend;
			}
		}

		return undefined;
	}

	private updateFriendList(): void {
		this.socialRepo.getFriends().subscribe((friends: UserProfile[]) => {
			this.friendsSubject.next(friends);
			this.friends = friends;
		});
	}

	private handleAcceptFriendRequestMessages(): void {
		this.mqService.getIncomingUserMessages().pipe(
				filter((message: StompMessage) => message.headers.type === MqMessageType.FRIEND_REQUEST_ACCEPTED),
				map((message: StompMessage) => {return message as AcceptFriendRequest})
		).subscribe(() => {
			this.updateFriendList();
		});
	}
}