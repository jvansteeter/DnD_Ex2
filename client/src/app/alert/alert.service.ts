import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timer } from 'rxjs';


@Injectable()
export class AlertService {
    public alertMessage: string;
    public alertVisibility: string;

    constructor() {
        this.alertMessage = '';
        this.alertVisibility = 'alertHide';
    }

    public showAlert(message: string): void {
        this.alertMessage = message;
        this.alertVisibility = 'alertShow';
        timer(2000).subscribe(() => this.alertVisibility = 'alertHide');
    }
}