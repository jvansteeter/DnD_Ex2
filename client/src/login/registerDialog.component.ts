import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { ErrorEmitterService } from './ErrorEmitter.service';
import { MatDialogRef } from '@angular/material';


@Component({
    selector: 'register-dialog',
    templateUrl: 'registerDialog.component.html',
    styleUrls: ['login.component.css']
})
export class RegisterDialogComponent {
    username: string = '';
    password: string = '';
    passwordConfirm: string = '';
    firstName: string = '';
    lastName: string = '';

    constructor(private loginService: LoginService,
                private errorService: ErrorEmitterService,
                private dialogRef: MatDialogRef<RegisterDialogComponent>) {

    }

    public register(): void {
        if (!this.username || !this.password || !this.passwordConfirm) {
            return;
        }

        if (this.password !== this.passwordConfirm) {
            this.errorService.emit('Passwords don\'t match');
            this.dialogRef.close();
            return;
        }

        this.loginService.register(this.username, this.password, this.firstName, this.lastName)
            .then(() => {
                this.loginService.login(this.username, this.password)
                    .then(() => window.location.href = '/')
                    .catch((error: Error) => {
                        this.errorService.emit(error.message);
                        this.dialogRef.close();
                });
            })
            .catch((error: Error) => {
                this.errorService.emit(error.message);
                this.dialogRef.close();
            })
    }
}
