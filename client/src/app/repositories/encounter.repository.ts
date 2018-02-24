import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class EncounterRepository {
    constructor(private http: HttpClient) {

    }

    public getEncounter(encounterId: string): Observable<any> {
        return this.http.get('api/encounter/encounter/' + encounterId, {responseType: 'json'});
    }
}