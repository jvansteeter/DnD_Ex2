import { Injectable } from '@angular/core';
import { SocialRepository } from './social.repository';
import { Observable } from 'rxjs';
import { UserProfile } from '../types/userProfile';
import { NotificationData } from "../../../../shared/types/notification-data";
import { MqService } from '../mq/mq.service';
import { FriendRequestMessage } from '../mq/friend-request.message';
import { IsReadyService } from '../utilities/services/isReady.service';

@Injectable()
export class SocialService extends IsReadyService {
	constructor(private socialRepo: SocialRepository,
	            private mqService: MqService) {
		super(mqService);
		this.init();
	}

	public init(): void {
		this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady) {
				this.setReady(true);
			}
			else {
				this.setReady(false);
			}
		});
	}

	public findUsers(criteria: string): Observable<any> {
		return this.socialRepo.findUsers(criteria);
	}

	public sendFriendRequest(toUserId: string): void {
		this.mqService.sendFriendRequest(toUserId);
	}

	public acceptRequest(fromUserId: string): void {
		this.socialRepo.acceptRequest(fromUserId);
	}

	public rejectFriendRequest(fromUserId: string): void {
		this.socialRepo.rejectFriendRequest(fromUserId);
	}

	public getPendingFriendRequests(): Observable<UserProfile[]> {
		return this.socialRepo.getPendingFriendRequests();
	}

	public getPendingNotifications(): Observable<NotificationData[]> {
		return this.socialRepo.getPendingNotifications();
	}

	public getFriends(): Observable<UserProfile[]> {
		return this.socialRepo.getFriends();
	}

	public acceptCampaignInvite(campaignId: string): void {

	}

	public getFriendInvites(): Observable<FriendRequestMessage> {
		return this.mqService.getFriendInvites();
	}
}