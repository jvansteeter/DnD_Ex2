import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CharacterSheetData } from '../../../../shared/types/rule-set/character-sheet.data';
import { CharacterData } from '../../../../shared/types/character.data';

@Injectable()
export class CharacterSheetRepository {
	constructor(private http: HttpClient) {

	}

	public getNpc(id: string): Observable<CharacterData> {
		return this.http.get<CharacterData>('/api/ruleset/npc/' + id, {responseType: 'json'});
	}

	public saveNpc(npcData: any): Observable<string> {
		return this.http.post('/api/ruleset/npc/save', npcData, {responseType: 'text'});
	}

	public saveCharacterSheet(characterSheet: any): Observable<string> {
		return this.http.post('/api/ruleset/charactersheet/save', characterSheet, {responseType: 'text'});
	}

	public getCharacterSheet(id: string): Observable<any> {
		return this.http.get<CharacterSheetData>('/api/ruleset/charactersheet/' + id, {responseType: 'json'});
	}
}
