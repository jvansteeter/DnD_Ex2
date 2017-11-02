import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CharacterSheetRepository {
    constructor(private http: HttpClient) {

    }

    getNpc(id: string): Observable<any> {
        return this.http.get('/api/ruleset/npc/' + id, {responseType: 'json'});
    }

    saveNpc(npcData: any): Observable<string> {
        return this.http.post('/api/ruleset/npc/save', npcData, {responseType: 'text'});
    }

    saveCharacterSheet(characterSheet: any): Observable<string> {
        return this.http.post('/api/ruleset/charactersheet/save', characterSheet, {responseType: 'text'});
    }
}
