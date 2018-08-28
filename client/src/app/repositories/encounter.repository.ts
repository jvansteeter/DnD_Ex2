import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { map } from 'rxjs/operators';
import { EncounterData } from '../../../../shared/types/encounter/encounter.data';
import { PlayerData } from '../../../../shared/types/encounter/player.data';
import { CharacterData } from '../../../../shared/types/character.data';
import { isUndefined } from "util";

@Injectable()
export class EncounterRepository {
	constructor(private http: HttpClient) {

	}

	public createNewEncounter(label: string, campaignId: string, cellRes: number, mapDimX?: number, mapDimY?: number, mapUrl?: string): Observable<void> {
		const image = new Image();
		image.src = mapUrl;
		let body;
		if (!isUndefined(mapUrl)) {
			body = {
				label: label,
				mapUrl: mapUrl,
				mapDimX: Math.ceil(image.naturalWidth / cellRes),
				mapDimY: Math.ceil(image.naturalHeight / cellRes),
			};
		}
		else {
			body = {
				label: label,
				mapDimX: mapDimX,
				mapDimY: mapDimY,
			}
		}

		return this.http.post('/api/campaign/newEncounter/' + campaignId, body, {responseType: 'text'}).pipe(map(() => {
			return;
		}));
	}

	public getEncounter(encounterId: string): Observable<EncounterData> {
		return this.http.get<EncounterData>('api/encounter/encounter/' + encounterId, {responseType: 'json'});
	}

	public setEncounter(encounterState: EncounterData): Observable<void> {
		return this.http.post('api/encounter/encounter/', encounterState).pipe(map(() => {return;}));
	}

	public addPlayer(encounterId: string, player: PlayerData): Observable<void> {
		const data = {
			encounterId: encounterId,
			player: player
		};
		return this.http.post('api/encounter/addplayer', data, {responseType: 'text'}).pipe(map(() => {
			return;
		}));
	}

	public addCharacters(encounterId: string, characters: CharacterData[]): Observable<void> {
		let data = {
			encounterId: encounterId,
			characters: characters
		};
		return this.http.post('/api/encounter/addcharacters', data, {responseType: 'text'}).pipe(map(() => {return;}));
	}

	public deleteEncounter(encounterId: string): Observable<void> {
		let data = {
			encounterId: encounterId
		};
		return this.http.post('/api/encounter/delete', data, {responseType: 'text'}).pipe(map(() => {return;}));
	}

	public openEncounter(encounterId: string): Observable<EncounterData> {
		let data = {
			encounterId: encounterId
		};
		return this.http.post<EncounterData>('/api/encounter/open', data, {responseType: 'json'});
	}

	public closeEncounter(encounterId: string): Observable<EncounterData> {
		let data = {
			encounterId: encounterId
		};
		return this.http.post<EncounterData>('/api/encounter/close', data, {responseType: 'json'});
	}
}
