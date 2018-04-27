import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Campaign } from '../../../../shared/types/campaign';

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
        return this.http.post('/api/campaign/join', {campaignId: campaignId}, {responseType: 'text'}).map(() => {
            return;
        });
    }

    public getCampaigns(): Observable<Campaign[]> {
        return this.http.get<Campaign[]>('/api/campaign/all', {responseType: 'json'});
    }

    public getCampaign(campaignId): Observable<any> {
        return this.http.get('/api/campaign/campaign/' + campaignId, {responseType: 'json'});
    }

    public getCampaignMembers(campaignId): Observable<any> {
        return this.http.get('/api/campaign/members/' + campaignId, {responseType: 'json'});
    }

    public createNewEncounter(label: string, campaignId: string): Observable<void> {
        return this.http.post('/api/campaign/newEncounter/' + campaignId, {label: label}, {responseType: 'text'}).map(() => {
            return;
        });
    }

    public getAllEncounters(campaignId: string): Observable<any> {
        return this.http.get('api/campaign/encounters/' + campaignId, {responseType: 'json'});
    }
}
