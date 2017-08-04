import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";


@Injectable()
export class LoginService {
    constructor(private http: Http) {}

    public login(username: string, password: string): Promise<boolean | Error> {
        let data = {
            username: username,
            password: password
        };
        return new Promise((resolve, reject) => {
            this.http.post('auth/login', data)
                .subscribe(() => {
                    resolve(true);
                }, error => {
                    reject(error);
                });
        });
    }
}
