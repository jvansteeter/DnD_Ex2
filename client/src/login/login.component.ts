import { Component, ViewChild } from '@angular/core';
import { LoginService } from './login.service';
import { MdDialog } from '@angular/material';
import { RegisterDialogComponent } from './registerDialog.component';
import { Observable } from 'rxjs/Observable';
import { ErrorEmitterService } from './ErrorEmitter.service';


@Component({
    selector: 'login-page',
    templateUrl: 'login.component.html',
    styleUrls: [ 'login.component.css' ]
})
export class LoginComponent {
    private usernameInput: string;
    private passwordInput: string;
    private alertVisibility: string = 'alertHide';
    private alertMessage: string;

    constructor(private loginService: LoginService,
                private errorService: ErrorEmitterService,
                private dialog: MdDialog) {
        this.errorService.subscribe((message) => {
            this.alert(message);
        })
    }

    public login(): void {
        this.loginService.login(this.usernameInput, this.passwordInput)
            .then(() => {
                window.location.href = 'app';
            }).catch(error => {
                this.alert(error.text());
            })
    }

    public openRegisterDialog(): void {
        this.dialog.open(RegisterDialogComponent);
    }

    private alert(message: string): void {
        this.alertMessage = message;
        this.alertVisibility = 'alertShow';
        Observable.timer(2000)
            .subscribe(() => this.alertVisibility = 'alertHide');
    }
}
