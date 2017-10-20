import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RuleSetHomeRepository {
    constructor(private http: HttpClient) {

    }

    getRuleSet(ruleSetId: string): Observable<any> {
        return this.http.get('/api/ruleset/ruleset/' + ruleSetId, {responseType: 'json'});
    }

    getCharacterSheets(ruleSetId: string): Observable<any> {
        return this.http.get('/api/ruleset/charactersheets/' + ruleSetId, {responseType: 'json'});
    }

    getAdmin(ruleSetId: string): Observable<any> {
        return this.http.get('/api/ruleset/admins/' + ruleSetId, {responseType: 'json'});
    }

    createNewNpc(label: string, characterSheetId: string): Observable<any> {
        return this.http.post('/api/ruleset/new/npc', {label: label, characterSheetId: characterSheetId}, {responseType: 'json'});
    }

    getNpcs(ruleSetId: string): Observable<any> {
        return this.http.get('/api/ruleset/npcs/' + ruleSetId, {responseType: 'json'});
    }
}