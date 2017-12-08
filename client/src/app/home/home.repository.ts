import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class HomeRepository {
    constructor(private http: HttpClient) {

    }

    public getRuleSets(): Observable<any> {
        return this.http.get('/api/ruleset/userrulesets', {responseType: 'json'});
    }

    public getCampaigns(): Observable<any> {
        return this.http.get('/api/campaign/all', {responseType: 'json'});
    }
}