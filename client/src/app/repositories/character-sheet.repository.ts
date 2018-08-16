import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CharacterSheetData } from '../../../../shared/types/rule-set/character-sheet.data';

@Injectable()
export class CharacterSheetRepository {

	constructor(private http: HttpClient) {

	}

	public saveCharacterSheet(characterSheet: any): Observable<string> {
		return this.http.post('/api/ruleset/charactersheet/save', characterSheet, {responseType: 'text'});
	}

	public getCharacterSheet(id: string): Observable<any> {
		return this.http.get<CharacterSheetData>('/api/ruleset/charactersheet/' + id, {responseType: 'json'});
	}
}