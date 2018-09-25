import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CharacterData } from '../../../../shared/types/character.data';
import { isUndefined } from "util";
import { map } from 'rxjs/operators';

@Injectable()
export class CharacterRepository {

	constructor(private http: HttpClient) {

	}

	public createNewCharacter(label: string, characterSheetId: string, isNpc: boolean = true, campaignId?: string): Observable<CharacterData> {
		let body = {
			label: label,
			characterSheetId: characterSheetId,
			npc: isNpc
		};
		if (!isUndefined(campaignId)) {
			body['campaignId'] = campaignId;
		}
		return this.http.post<CharacterData>('/api/character/new', body, {responseType: 'json'});
	}

	public getCharacter(id: string): Observable<CharacterData> {
		return this.http.get<CharacterData>('/api/character/character/' + id, {responseType: 'json'});
	}

	public saveCharacter(characterData: CharacterData): Observable<string> {
		return this.http.post('/api/character/save', characterData, {responseType: 'text'});
	}

	public getCharactersByCampaignId(campaignId: string): Observable<CharacterData[]> {
		return this.http.get<CharacterData[]>('/api/character/campaign/characters/' + campaignId, {responseType: 'json'});
	}

	public getAllByCampaignId(campaignId: string): Observable<{campaignCharacters: CharacterData[], ruleSetNPCs: CharacterData[]}> {
		return this.http.get<{campaignCharacters: CharacterData[], ruleSetNPCs: CharacterData[]}>('/api/character/campaign/all/'
			+ campaignId, {responseType: 'json'});
	}

	public deleteCharacter(characterId: string): Observable<void> {
		const body = {
			characterId: characterId
		};

		return this.http.post('/api/character/delete', body, {responseType: 'text'}).pipe(map(() => {
			return;
		}));
	}
}
