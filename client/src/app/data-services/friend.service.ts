import { Injectable } from '@angular/core';
import { SocialRepository } from '../social/social.repository';
import { Observable } from 'rxjs';
import { UserProfile } from '../types/userProfile';
import { MqService } from '../mq/mq.service';
import { FriendRequestMessage } from '../mq/friend-request.message';
import { IsReadyService } from '../utilities/services/isReady.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

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
		});
	}

	public rejectFriendRequest(fromUserId: string): void {
		this.socialRepo.rejectFriendRequest(fromUserId);
	}

	public getIncomingFriendRequests(): Observable<FriendRequestMessage> {
		return this.mqService.getIncomingFriendRequests();
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
}