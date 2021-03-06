import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../types/userProfile';
import { map } from 'rxjs/operators';
import { CampaignData } from '../../../../shared/types/campaign.data';
import { EncounterData } from '../../../../shared/types/encounter/encounter.data';

@Injectable()
export class CampaignRepository {
	constructor(private http: HttpClient) {

	}

	public createNewCampaign(label: string, ruleSetId: string): Observable<any> {
		let body = {
			label: label,
			ruleSetId: ruleSetId
		};
		return this.http.post('/api/campaign/create', body, {responseType: 'json'});
	}

	public joinCampaign(campaignId: string): Observable<void> {
		return this.http.post('/api/campaign/join', {campaignId: campaignId}, {responseType: 'text'}).pipe(map(() => {
			return;
		}));
	}

	public getCampaigns(): Observable<CampaignData[]> {
		return this.http.get<CampaignData[]>('/api/campaign/all', {responseType: 'json'});
	}

	public getCampaign(campaignId): Observable<CampaignData> {
		return this.http.get<CampaignData>('/api/campaign/campaign/' + campaignId, {responseType: 'json'});
	}

	public getCampaignMembers(campaignId): Observable<UserProfile[]> {
		return this.http.get<UserProfile[]>('/api/campaign/members/' + campaignId, {responseType: 'json'});
	}

	public getAllEncounters(campaignId: string): Observable<EncounterData[]> {
		return this.http.get<EncounterData[]>('api/campaign/encounters/' + campaignId, {responseType: 'json'});
	}

	public setIsGameMaster(campaignId: string, userId: string, isGameMaster: boolean): Observable<void> {
		const body = {
			campaignId: campaignId,
			userId: userId,
			isGameMaster: isGameMaster ? 'true' : 'false'
		};

		return this.http.post<void>('/api/campaign/setGameMaster', body);
	}

	public deleteCampaign(campaignId: string): Observable<void> {
		return this.http.post<void>('/api/campaign/delete', {campaignId: campaignId});
	}

	public sendInvite(userId: string, campaignId: string): Observable<void> {
		const body = {
			userId,
			campaignId,
		};
		return this.http.post<void>('/api/campaign/invite', body);
	}
}
