import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../types/userProfile';
import { map } from 'rxjs/operators';
import { CampaignData } from '../../../../shared/types/campaign.data';
import { EncounterData } from '../../../../shared/types/encounter/encounter.data';
import { isUndefined } from 'util';

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

	public createNewEncounter(label: string, campaignId: string, mapDimX?: number, mapDimY?: number, mapUrl?: string): Observable<void> {
		const image = new Image();
		image.src = mapUrl;
    let body;
    if (!isUndefined(mapUrl)) {
	    body = {
		    label: label,
		    mapUrl: mapUrl,
		    mapDimX: image.naturalWidth / 50,
		    mapDimY: image.naturalHeight / 50,
	    };
    }
    else {
    	body = {
    		label: label,
		    mapDimX: mapDimX,
		    mapDimY: mapDimY,
	    }
    }

		return this.http.post('/api/campaign/newEncounter/' + campaignId, body, {responseType: 'text'}).pipe(map(() => {
			return;
		}));
	}

	public getAllEncounters(campaignId: string): Observable<EncounterData[]> {
		return this.http.get<EncounterData[]>('api/campaign/encounters/' + campaignId, {responseType: 'json'});
	}
}
