import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

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

    public getCampaigns(): Observable<any> {
        return this.http.get('/api/campaign/all', {responseType: 'json'});
    }

    public getCampaign(campaignId): Observable<any> {
        return this.http.get('/api/campaign/campaign/' + campaignId, {responseType: 'json'});
    }

    public getCampaignMembers(campaignId): Observable<any> {
        return this.http.get('/api/campaign/members/' + campaignId, {responseType: 'json'});
    }

    public sendInvitations(campaignId: string, userIds: string[]): Observable<void> {
        return this.http.post<void>('/api/campaign/invite/' + campaignId, userIds);
    }
}
