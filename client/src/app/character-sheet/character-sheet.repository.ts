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

    getCharacterSheet(id: string): Observable<any> {
        return this.http.get('/api/ruleset/charactersheet/' + id, {responseType: 'json'});
    }
}
