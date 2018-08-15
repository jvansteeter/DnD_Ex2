import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { map } from 'rxjs/operators';
import { EncounterData } from '../../../../shared/types/encounter/encounter.data';
import { PlayerData } from '../../../../shared/types/encounter/player.data';

@Injectable()
export class UserRepository {
	constructor(private http: HttpClient) {

	}

	public getUserProfile(): Observable<any> {
		return this.http.get<EncounterData>('/api/user/profile', {responseType: 'json'});
	}

	public setProfilePhoto(url: string): Observable<void> {
		return this.http.post('api/user/profilephoto', {imageUrl: url}, {responseType: 'text'})
				.pipe(map(() => {return;}));
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