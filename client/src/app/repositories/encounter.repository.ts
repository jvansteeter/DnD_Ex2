import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { map } from 'rxjs/operators';
import { EncounterData } from '../../../../shared/types/encounter/encounter.data';
import { PlayerData } from '../../../../shared/types/encounter/player.data';
import { CharacterData } from '../../../../shared/types/character.data';
import { isUndefined } from "util";
import { NotationData } from '../../../../shared/types/encounter/board/notation.data';
import { BoardNotationGroup } from '../board/shared/notation/board-notation-group';

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

	public addPlayer(encounterId: string, player: PlayerData): Observable<void> {
		const data = {
			encounterId: encounterId,
			player: player
		};
		return this.http.post<void>('api/encounter/addplayer', data);
	}

	public removePlayer(player: PlayerData): Observable<void> {
		const data = {
			player: player
		};
		return this.http.post<void>('api/encounter/removeplayer', data);
	}

	public addCharacters(encounterId: string, characters: CharacterData[]): Observable<void> {
		let data = {
			encounterId: encounterId,
			characters: characters
		};
		return this.http.post<void>('/api/encounter/addcharacters', data);
	}

	public deleteEncounter(encounterId: string): Observable<void> {
		let data = {
			encounterId: encounterId
		};
		return this.http.post<void>('/api/encounter/delete', data);
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

	public addNewNotation(encounterId: string): Observable<BoardNotationGroup> {
		const data = {
			encounterId: encounterId
		};
		return this.http.post<NotationData>('/api/encounter/addNotation', data, {responseType: 'json'})
				.pipe(map((notation: NotationData) => {
					return new BoardNotationGroup(notation);
				}));
	}

	public removeNotation(notationId: string): Observable<void> {
		const data = {
			notationId: notationId
		};
		return this.http.post<void>('/api/encounter/removeNotation', data);
	}
}
