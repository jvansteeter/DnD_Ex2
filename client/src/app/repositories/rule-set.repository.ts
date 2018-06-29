import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class RuleSetRepository {
    constructor(private http: HttpClient) {

    }

    public getRuleSets(): Observable<any> {
        return this.http.get('/api/ruleset/userrulesets', {responseType: 'json'});
    }

    public getRuleSet(ruleSetId: string): Observable<any> {
        return this.http.get('/api/ruleset/ruleset/' + ruleSetId, {responseType: 'json'});
    }

    public getCharacterSheets(ruleSetId: string): Observable<any> {
        return this.http.get('/api/ruleset/charactersheets/' + ruleSetId, {responseType: 'json'});
    }

    public getAdmin(ruleSetId: string): Observable<any> {
        return this.http.get('/api/ruleset/admins/' + ruleSetId, {responseType: 'json'});
    }

    public createNewNpc(label: string, characterSheetId: string): Observable<any> {
        return this.http.post('/api/ruleset/new/npc', {label: label, characterSheetId: characterSheetId}, {responseType: 'json'});
    }

    public getNpcs(ruleSetId: string): Observable<any> {
        return this.http.get('/api/ruleset/npcs/' + ruleSetId, {responseType: 'json'});
    }
}