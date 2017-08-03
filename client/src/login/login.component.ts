import {Component} from "@angular/core";
import {LoginService} from "./login.service";


@Component({
    selector: 'login-page',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent {
    private usernameInput: string;
    private passwordInput: string;
    private alertMessage: string;

    constructor(private loginService: LoginService) {}

    public login(): void {
        this.loginService.login(this.usernameInput, this.passwordInput)
            .subscribe((response) => {
                console.log('got a response from the server');
                console.log(response);
                window.location.href = 'app';
            });
    }
}
