import { Injectable } from '@angular/core';
import { SocialRepository } from './social.repository';
import { Observable } from 'rxjs';
import { UserProfile } from '../types/userProfile';
import { NotificationData } from "../../../../shared/types/notification-data";
import { MqService } from '../mq/mq.service';

@Injectable()
export class SocialService {
	constructor(private socialRepo: SocialRepository,
	            private mqService: MqService) {
	}

	public findUsers(criteria: string): Observable<any> {
		return this.socialRepo.findUsers(criteria);
	}

	public sendFriendRequest(toUserId: string): void {
		console.log('SocialService.sendFriendRequest()')
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
}