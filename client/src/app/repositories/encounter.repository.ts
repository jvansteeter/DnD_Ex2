import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { map } from 'rxjs/operators';
import { EncounterData } from '../../../../shared/types/encounter/encounter.data';
import { PlayerData } from '../../../../shared/types/encounter/player.data';

@Injectable()
export class EncounterRepository {
	constructor(private http: HttpClient) {

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
}