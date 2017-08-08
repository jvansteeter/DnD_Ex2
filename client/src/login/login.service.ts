import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";


@Injectable()
export class LoginService {
    constructor(private http: Http) {}

    public login(username: string, password: string): Promise<Error> {
        let data = {
            username: username,
            password: password
        };
        return new Promise((resolve, reject) => {
            this.http.post('auth/login', data)
                .subscribe(() => {
                    resolve();
                }, error => {
                    reject(error);
                });
        });
    }

    public register(username: string, password: string, firstName: string, lastName: string): Promise<Error> {
        let data = {
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName
        };

        return new Promise((resolve, reject) => {
            this.http.post('auth/register', data)
                .subscribe(() => {
                    resolve();
                }, error => {
                    reject(new Error(error.text()));
                })
        })
    }
}
