import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CharacterData } from '../../../../shared/types/character.data';

@Injectable()
export class CharacterRepository {

	constructor(private http: HttpClient) {

	}

	public createNewCharacter(label: string, characterSheetId: string, isNpc: boolean = true): Observable<CharacterData> {
		return this.http.post<CharacterData>('/api/character/new', {
			label: label,
			characterSheetId: characterSheetId,
			npc: isNpc
		}, {responseType: 'json'});
	}

	public getCharacter(id: string): Observable<CharacterData> {
		return this.http.get<CharacterData>('/api/character/character/' + id, {responseType: 'json'});
	}

	public saveCharacter(characterData: CharacterData): Observable<string> {
		return this.http.post('/api/character/save', characterData, {responseType: 'text'});
	}
}
