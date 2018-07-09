import { Injectable } from '@angular/core';
import { SocialRepository } from '../social/social.repository';
import { Observable } from 'rxjs';
import { UserProfile } from '../types/userProfile';
import { MqService } from '../mq/mq.service';
import { FriendRequestMessage } from '../mq/messages/friend-request.message';
import { IsReadyService } from '../utilities/services/isReady.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
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
		this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady) {
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

	public rejectFriendRequest(fromUserId: string): void {
		this.socialRepo.rejectFriendRequest(fromUserId);
	}

	public getIncomingFriendRequests(): Observable<FriendRequestMessage> {
		return this.mqService.getIncomingUserMessages().pipe(
				filter((message: StompMessage) => message.headers.type === MqMessageType.FRIEND_REQUEST),
				map((message: StompMessage) => {
					return message as FriendRequestMessage
				})
		);
	}

	public getFriendsSubject(): Subject<UserProfile[]> {
		return this.friendsSubject;
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