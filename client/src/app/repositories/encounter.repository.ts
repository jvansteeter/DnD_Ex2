import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {PlayerData} from "../../../../shared/types/encounter/player";
import { EncounterStateData } from '../../../../shared/types/encounter/encounterState';

@Injectable()
export class EncounterRepository {
	constructor(private http: HttpClient) {

	}

	public getEncounter(encounterId: string): Observable<EncounterStateData> {
		return this.http.get<EncounterStateData>('api/encounter/encounter/' + encounterId, {responseType: 'json'});
	}

	public addPlayer(encounterId: string, player: PlayerData): Observable<void> {
		const data = {
			encounterId: encounterId,
			player: player
		};
		return this.http.post<void>('api/encounter/addplayer', data);
	}
}