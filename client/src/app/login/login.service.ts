import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";


@Injectable()
export class LoginService {
    constructor(private http: Http) {}

    public login(username: string, password: string): Observable<Response> {
        let data = {
            username: username,
            password: password
        };

        return this.http.post('auth/login', data)
    }
}
